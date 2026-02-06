import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // Sentry build options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in CI/production
  silent: !process.env.CI,

  // Automatically tree-shake Sentry logger
  disableLogger: true,

  // Skip source map upload if no auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
