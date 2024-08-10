import { getModel } from '@base-shared';
import { NotificationRule, Rules } from '@offisito-shared';

export default () =>
  getModel<NotificationRule>('notificationRule', {
    userId: { type: String },
    key: {
      type: String,
      enum: [...Object.keys(Rules)],
    },
    push: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    sms: {
      type: Boolean,
      default: false,
    },
  });
