import { DismissibleNotice } from "./DismissibleNotice";

interface Props {
  /** Stable id used to remember dismissal across reloads */
  id: string;
  message: string;
  /** Optional secondary line */
  hint?: string;
  className?: string;
}

/**
 * Preview-only ribbon. Renders only on Lovable preview / localhost hosts so
 * placeholder reminders never ship to production.
 */
export const TemplatePlaceholderRibbon = ({ id, message, hint, className }: Props) => (
  <DismissibleNotice
    id={`tpl-ribbon:${id}`}
    tone="preview"
    title={message}
    previewOnly
    className={className}
  >
    {hint}
  </DismissibleNotice>
);
