
-- 1. Extend marketing_subscribers with double opt-in + consent audit fields
ALTER TABLE public.marketing_subscribers
  ADD COLUMN IF NOT EXISTS confirmation_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_ip INET,
  ADD COLUMN IF NOT EXISTS consent_user_agent TEXT,
  ADD COLUMN IF NOT EXISTS consent_text TEXT;

-- Change default status for new rows (existing rows keep their current status)
ALTER TABLE public.marketing_subscribers
  ALTER COLUMN status SET DEFAULT 'pending'::subscriber_status;

-- Make sure the enum has the values we need
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='pending' AND enumtypid='public.subscriber_status'::regtype) THEN
    ALTER TYPE public.subscriber_status ADD VALUE 'pending';
  END IF;
END $$;

-- 2. Extend site_settings with sender + mailing address
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS mailing_address TEXT,
  ADD COLUMN IF NOT EXISTS company_legal_name TEXT,
  ADD COLUMN IF NOT EXISTS from_name TEXT,
  ADD COLUMN IF NOT EXISTS from_email TEXT,
  ADD COLUMN IF NOT EXISTS reply_to TEXT;

-- Seed defaults (only fill if currently null)
UPDATE public.site_settings
SET
  mailing_address = COALESCE(mailing_address, '1060 W Addison St, Chicago, IL 60613, USA'),
  company_legal_name = COALESCE(company_legal_name, 'Blues Brothers Holdings, LLC'),
  from_name = COALESCE(from_name, 'Jake & Elwood'),
  from_email = COALESCE(from_email, 'newsletter@notify.voicept.com'),
  reply_to = COALESCE(reply_to, 'hello@notify.voicept.com')
WHERE id = 1;

INSERT INTO public.site_settings (id, mailing_address, company_legal_name, from_name, from_email, reply_to)
SELECT 1, '1060 W Addison St, Chicago, IL 60613, USA', 'Blues Brothers Holdings, LLC', 'Jake & Elwood', 'newsletter@notify.voicept.com', 'hello@notify.voicept.com'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE id = 1);

-- 3. Per-recipient broadcast tracking
CREATE TABLE IF NOT EXISTS public.marketing_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.marketing_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- queued | sent | failed | skipped
  error TEXT,
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, email)
);

GRANT SELECT ON public.marketing_campaign_recipients TO authenticated;
GRANT ALL ON public.marketing_campaign_recipients TO service_role;

ALTER TABLE public.marketing_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view campaign recipients"
ON public.marketing_campaign_recipients FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign ON public.marketing_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON public.marketing_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirmation_token ON public.marketing_subscribers(confirmation_token);

-- 4. Security-definer reader for confirmed subscribers (used by broadcast edge function)
CREATE OR REPLACE FUNCTION public.list_confirmed_subscriber_emails()
RETURNS TABLE(id UUID, email TEXT, name TEXT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, email, name
  FROM public.marketing_subscribers
  WHERE status = 'subscribed'
    AND confirmed_at IS NOT NULL
$$;

REVOKE ALL ON FUNCTION public.list_confirmed_subscriber_emails() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_confirmed_subscriber_emails() TO service_role;
