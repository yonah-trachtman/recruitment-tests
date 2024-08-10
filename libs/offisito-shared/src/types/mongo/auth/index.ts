import { Document } from 'mongoose';
import { User as BasicUser } from '@auth-backend';

export enum UserType {
  'admin' = 'admin',
  'host' = 'host',
  'guest' = 'guest',
}

export interface User extends BasicUser<false, false, true, UserType> {
  phone: string;
  fname?: string;
  lname?: string;
  userType: UserType;
}

export interface RegistrationRequest extends Document {
  email: string;
  key: string;
}

export interface PassResetRequest extends Document {
  email: string;
  key: string;
}
