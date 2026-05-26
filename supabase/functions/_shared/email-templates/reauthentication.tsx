/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import { brand, codeBlock, container, footer, h1, main, text } from './_styles.ts'

interface ReauthenticationEmailProps {
  siteName?: string
  token: string
}

export const ReauthenticationEmail = ({ siteName = 'SaaS Starter', token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code: {token}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{siteName}</Text>
        <Heading style={h1}>Confirm it's you</Heading>
        <Text style={text}>
          Enter this code to confirm your identity. It expires in 10 minutes.
        </Text>
        <Text style={codeBlock}>{token}</Text>
        <Text style={footer}>
          Didn't request this code? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail
