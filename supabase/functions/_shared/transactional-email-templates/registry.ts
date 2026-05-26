/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as welcome } from './welcome.tsx'
import { template as inviteTeammate } from './invite-teammate.tsx'
import { template as subscriptionReceipt } from './subscription-receipt.tsx'
import { template as passwordChanged } from './password-changed.tsx'
import { template as newsletterConfirm } from './newsletter-confirm.tsx'
import { template as newsletterWelcome } from './newsletter-welcome.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  welcome,
  'invite-teammate': inviteTeammate,
  'subscription-receipt': subscriptionReceipt,
  'password-changed': passwordChanged,
  'newsletter-confirm': newsletterConfirm,
  'newsletter-welcome': newsletterWelcome,
}
