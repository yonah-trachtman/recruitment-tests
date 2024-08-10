import { AuthenticatedRequest } from '@auth-backend';
import { UserType } from '@offisito-shared';
import { TODO } from '@base-shared';

export const adminAuth = async (req: AuthenticatedRequest, res, next) =>
  (req.user as TODO).userType === UserType.admin
    ? next()
    : res.status(401).send('You are not an Admin');
