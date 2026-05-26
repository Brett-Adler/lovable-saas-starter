/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import { brand, button, container, footer, h1, main, text } from './_styles.ts'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email to get started with {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{siteName}</Text>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Welcome aboard! Tap the button below to verify your email and finish setting up your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm email
        </Button>
        <Text style={text}>
          The link expires in 24 hours. If it stops working, just sign up again and we'll send a fresh one.
        </Text>
        <Text style={footer}>
          Didn't create an account? You can safely ignore this email — nothing will happen.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail
