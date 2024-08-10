import { UserType } from '@offisito-shared';
import { settings } from '../../../config';

import { OAuth2Client } from 'google-auth-library';

const redirectUriGeneretor = (client: UserType) =>
  settings.clientDomains[client] + '/auth/oauth2callback';

const oauth2ClientGenerator = (client: UserType) =>
  new OAuth2Client(
    settings.googleClientId,
    settings.googleClientSecret,
    redirectUriGeneretor(client),
  );

export let oauth2ClientGuest = oauth2ClientGenerator(UserType.guest);
export let oauth2ClientHost = oauth2ClientGenerator(UserType.host);
export let oauth2ClientAdmin = oauth2ClientGenerator(UserType.admin);

export const oauth2ClientGetter = (client: UserType) => {
  switch (client) {
    case UserType.guest:
      return oauth2ClientGuest;
    case UserType.host:
      return oauth2ClientHost;
    case UserType.admin:
      return oauth2ClientAdmin;
  }
};

const scopes = ['https://www.googleapis.com/auth/userinfo.email'];

export const authUrlGenrator = (client: UserType) =>
  oauth2ClientGetter(client).generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
