/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = Deno.env.get('PUBLIC_SITE_NAME') ?? 'Your App'

interface NewsletterWelcomeProps {
  name?: string
  mailingAddress?: string
}

const NewsletterWelcomeEmail = ({
  name,
  mailingAddress = '',
}: NewsletterWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're on the list — welcome to the {SITE_NAME} newsletter</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>
          {name ? `You're in, ${name}.` : `You're in.`}
        </Heading>
        <Text style={text}>
          Thanks for confirming. We'll send one email a month with product
          updates, new templates, and behind-the-scenes notes. No filler.
        </Text>
        <Text style={text}>
          Want to send us something? Just reply to this email — a real human
          will see it.
        </Text>
        <Text style={footer}>
          You're receiving this because you confirmed your subscription to the
          {' '}{SITE_NAME} newsletter. Every email we send includes a one-click
          unsubscribe link in the footer.
          {mailingAddress ? <><br /><br />{mailingAddress}</> : null}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewsletterWelcomeEmail,
  subject: `You're on the list — welcome to ${SITE_NAME}`,
  displayName: 'Newsletter — welcome',
  previewData: {
    name: 'Sam',
    mailingAddress: '',
  },
} satisfies TemplateEntry
