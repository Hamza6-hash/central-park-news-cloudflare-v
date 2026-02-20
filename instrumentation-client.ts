// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://49bc3ac620b3470be62f239a41571a98@o4509228688080896.ingest.us.sentry.io/4510899543277568",

  // Ignore AbortError — expected when fetches are cancelled (navigation, query cancel, Suspense)
  ignoreErrors: [
    /^AbortError$/,
    /^AbortError: AbortError$/,
    /^canceled$/,
    /^The operation was aborted\.?$/,
  ],

  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error instanceof DOMException && error.name === "AbortError" && error.code === 20) {
      return null;
    }
    return event;
  },

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
