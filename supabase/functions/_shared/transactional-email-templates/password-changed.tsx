/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = 'SaaS Starter'
const SITE_URL = 'https://saas-starter.lovable.app'

interface PasswordChangedProps {
  name?: string
  changedAt?: string
}

const PasswordChangedEmail = ({ name, changedAt }: PasswordChangedProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} password was just changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>Your password was changed</Heading>
        <Text style={text}>
          {name ? `Hi ${name}, ` : ''}we wanted to let you know that the password on your
          {' '}{SITE_NAME} account was updated{changedAt ? ` on ${changedAt}` : ''}.
        </Text>
        <Text style={text}>
          If this was you, you're all set — no further action needed.
        </Text>
        <Text style={text}>
          If this <strong>wasn't</strong> you, secure your account right away:
        </Text>
        <Button style={button} href={`${SITE_URL}/forgot-password`}>
          Reset your password
        </Button>
        <Text style={footer}>
          This is a security notification — you'll always receive one when your password changes.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PasswordChangedEmail,
  subject: `Your ${SITE_NAME} password was changed`,
  displayName: 'Password changed',
  previewData: { name: 'Alex', changedAt: 'May 26, 2026 at 2:14 PM' },
} satisfies TemplateEntry
