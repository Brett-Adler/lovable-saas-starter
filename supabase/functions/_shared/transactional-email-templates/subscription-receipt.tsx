/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = Deno.env.get('PUBLIC_SITE_NAME') ?? 'Your App'
const SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') ?? '').replace(/\/$/, '')

interface ReceiptProps {
  planName?: string
  amount?: string
  interval?: 'month' | 'year'
  renewalDate?: string
  environment?: 'sandbox' | 'live'
}

const SubscriptionReceiptEmail = ({
  planName = 'Pro', amount, interval = 'month', renewalDate, environment = 'live',
}: ReceiptProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} subscription is active</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>You're on the {planName} plan</Heading>
        <Text style={text}>
          Thanks for subscribing! Your account is upgraded and every feature is unlocked.
        </Text>
        <Section style={summaryBox}>
          <Text style={summaryRow}><span style={summaryLabel}>Plan</span><span style={summaryValue}>{planName}</span></Text>
          {amount ? (
            <Text style={summaryRow}><span style={summaryLabel}>Billed</span><span style={summaryValue}>{amount} / {interval}</span></Text>
          ) : null}
          {renewalDate ? (
            <Text style={summaryRow}><span style={summaryLabel}>Renews</span><span style={summaryValue}>{renewalDate}</span></Text>
          ) : null}
        </Section>
        {environment === 'sandbox' ? (
          <Text style={testBadge}>Test mode — no real payment was charged.</Text>
        ) : null}
        <Button style={button} href={`${SITE_URL}/dashboard/billing`}>
          Manage billing
        </Button>
        <Text style={footer}>
          A detailed invoice is available in your Stripe customer portal, accessible from the Billing page.
        </Text>
      </Container>
    </Body>
  </Html>
)

const summaryBox = {
  backgroundColor: '#faf7f5',
  borderRadius: '14px',
  padding: '20px 24px',
  margin: '0 0 28px',
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#1f1f2e',
  margin: '0 0 8px',
  lineHeight: '1.6',
}

const summaryLabel = { color: '#9a9aa8', fontWeight: 500 as const }
const summaryValue = { color: '#1f1f2e', fontWeight: 600 as const }
const testBadge = {
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 600 as const,
  color: '#b8541d',
  backgroundColor: '#fff1ec',
  borderRadius: '999px',
  padding: '4px 12px',
  margin: '0 0 24px',
}

export const template = {
  component: SubscriptionReceiptEmail,
  subject: (data) => `Your ${SITE_NAME} ${data.planName || 'Pro'} subscription is active`,
  displayName: 'Subscription receipt',
  previewData: {
    planName: 'Pro',
    amount: '$29.00',
    interval: 'month',
    renewalDate: 'June 26, 2026',
    environment: 'live',
  },
} satisfies TemplateEntry
