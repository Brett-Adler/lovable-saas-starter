/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import { brand, button, container, footer, h1, main, text } from './_styles.ts'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your {siteName} password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{siteName}</Text>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          Someone — hopefully you — asked to reset the password for your {siteName} account. Tap the button below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Choose new password
        </Button>
        <Text style={text}>
          The link expires in 1 hour.
        </Text>
        <Text style={footer}>
          Didn't ask to reset your password? You can safely ignore this email — your password won't change.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail
