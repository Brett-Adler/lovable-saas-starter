/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = Deno.env.get('PUBLIC_SITE_NAME') ?? 'Your App'

interface NewsletterConfirmProps {
  name?: string
  confirmUrl?: string
  mailingAddress?: string
}

const NewsletterConfirmEmail = ({
  name,
  confirmUrl = 'https://example.com/newsletter/confirm',
  mailingAddress = '',
}: NewsletterConfirmProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your subscription to the {SITE_NAME} newsletter</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>
          {name ? `One more step, ${name}.` : 'One more step.'}
        </Heading>
        <Text style={text}>
          Tap the button below to confirm you want monthly updates from {SITE_NAME}.
          We'll send you product news, new templates, and behind-the-scenes notes —
          one email a month, no spam, unsubscribe anytime.
        </Text>
        <Button style={button} href={confirmUrl}>
          Confirm my subscription
        </Button>
        <Text style={text}>
          If the button doesn't work, copy and paste this link into your browser:
          <br />
          <a href={confirmUrl} style={{ color: '#f5532d', wordBreak: 'break-all' }}>{confirmUrl}</a>
        </Text>
        <Text style={footer}>
          You're receiving this one-time confirmation because someone (hopefully you)
          asked to subscribe to the {SITE_NAME} newsletter. If that wasn't you, just
          ignore this email — we won't add you to the list.
          {mailingAddress ? <><br /><br />{mailingAddress}</> : null}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewsletterConfirmEmail,
  subject: `Confirm your ${SITE_NAME} newsletter subscription`,
  displayName: 'Newsletter — confirm subscription',
  previewData: {
    name: 'Sam',
    confirmUrl: 'https://example.com/newsletter/confirm?token=demo',
    mailingAddress: '',
  },
} satisfies TemplateEntry
