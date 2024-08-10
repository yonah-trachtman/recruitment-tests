import { Router } from 'express';
import geo from './geo';
import notifications from './notifications';
import bookings from './bookings';
import search from './search';
import admin from './admin';
import amenities from './amenities';
import host from './host';
import {
  authRouter,
  createStrategy,
  ExternalIdentityProviders,
  MFA,
  MultiClientType,
  MultiUserType,
  PasswordType,
  VerifiedContactMethod,
} from '@auth-backend';
import user from '../../services/mongo/auth/user';
import { UserType } from '@offisito-shared';
import {
  guestRegisterReq,
  resetPassword,
} from '../../content/email-templates/auth';
import { generateChatRouter } from '@chat-backend';
import { specialChatRouter } from './chat';

export const authStrategy = createStrategy<{}, {}, UserType, false, false>({
  enumValues: Object.values(UserType),
  genRegisterEmail: guestRegisterReq,
  genPassResetEmail: resetPassword,
  optionalFields: [],
  requiredEnums: [],
  requiredFields: [],
  MIN_PASSWORD_STRENGTH: 2,
  externalIdentityProviders: ExternalIdentityProviders.OFF,
  mfa: MFA.OFF,
  modelMap: () => user(),
  multiUserType: MultiUserType.MULTI_BY_ROLES,
  multiClientType: MultiClientType.MULTI,
  passwordType: PasswordType.HASHED,
  verifiedContactMethod: VerifiedContactMethod.EMAIL,
});
export const sidesNames: [string, string] = ['hostId', 'guestId'];

export const apiRouter = Router();

// accounts:
apiRouter.use('/auth', authRouter(authStrategy));
apiRouter.use('/notifications', notifications);

// host:
apiRouter.use('/host', host);

// guest and host:
apiRouter.use('/search', search);
apiRouter.use('/bookings', bookings);

apiRouter.use('/chat', generateChatRouter(...sidesNames));
apiRouter.use('/chat', specialChatRouter);

// utils:
apiRouter.use('/geo', geo);

// admin:
apiRouter.use('/admin', admin);
apiRouter.use('/amenities', amenities);
