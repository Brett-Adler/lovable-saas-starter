/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = Deno.env.get('PUBLIC_SITE_NAME') ?? 'Your App'
const SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') ?? '').replace(/\/$/, '')

interface WelcomeProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — let's get you set up</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{SITE_NAME}</Text>
        <Heading style={h1}>
          {name ? `Welcome, ${name}!` : 'Welcome aboard!'}
        </Heading>
        <Text style={text}>
          Thanks for joining {SITE_NAME}. Your 14-day trial has started — no credit card needed.
          Hop into your dashboard to invite teammates, configure billing, and explore the platform.
        </Text>
        <Button style={button} href={`${SITE_URL}/dashboard`}>
          Open your dashboard
        </Button>
        <Text style={text}>
          Need a hand? Just reply to this email — a real human will get back to you.
        </Text>
        <Text style={footer}>
          You're receiving this because you signed up for {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: `Welcome to ${SITE_NAME}`,
  displayName: 'Welcome',
  previewData: { name: 'Alex' },
} satisfies TemplateEntry
