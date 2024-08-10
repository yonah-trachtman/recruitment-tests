import { getEmailSettings } from '@email-backend';
import { authSettings } from '@auth-backend';
import { s3Settings } from '@s3-backend';
import { getBaseSettings, validateSettings } from '@base-backend';

export const settings = {
  ...getBaseSettings(),
  ...getEmailSettings(),
  ...authSettings,
  ...s3Settings,
  googleGeoCoding: process.env.GOOGLE_GEO_CODING || '',
  stripeApiKey: process.env.STRIPE_API_KEY || '',
  push: process.env.PUSH || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
};

validateSettings(settings);
