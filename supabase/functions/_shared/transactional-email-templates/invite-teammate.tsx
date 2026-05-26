/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, button, container, footer, h1, main, text } from '../email-templates/_styles.ts'

const SITE_NAME = 'SaaS Starter'

interface InviteProps {
  inviterName?: string
  organizationName?: string
  acceptUrl?: string
  role?: string
}

const InviteTeammateEmail = ({
  inviterName, organizationName, acceptUrl, role,
}: InviteProps) => {
  const org = organizationName || 'a team'
  const inviter = inviterName || 'Someone'
  const url = acceptUrl || 'https://saas-starter.lovable.app/login'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{inviter} invited you to {org} on {SITE_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>{SITE_NAME}</Text>
          <Heading style={h1}>You're invited to {org}</Heading>
          <Text style={text}>
            <strong>{inviter}</strong> invited you to join <strong>{org}</strong>
            {role ? <> as a <strong>{role}</strong></> : null} on {SITE_NAME}.
            Accept the invite to start collaborating.
          </Text>
          <Button style={button} href={url}>
            Accept invitation
          </Button>
          <Text style={footer}>
            Not expecting this? You can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: InviteTeammateEmail,
  subject: (data) =>
    `${data.inviterName || 'Someone'} invited you to ${data.organizationName || 'a team'} on ${SITE_NAME}`,
  displayName: 'Teammate invitation',
  previewData: {
    inviterName: 'Alex Chen',
    organizationName: 'Acme Inc',
    role: 'member',
    acceptUrl: 'https://saas-starter.lovable.app/invite/sample-token',
  },
} satisfies TemplateEntry
