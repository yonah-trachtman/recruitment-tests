import { User, UserType } from '@offisito-shared';
import { userBasicSchema } from '@auth-backend';
import { getModel } from '@base-shared';

export default () =>
  getModel<User>('user', {
    ...userBasicSchema(false, false),
    phone: {
      type: String,
      unique: false,
    },
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
    },
  });
