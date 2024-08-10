import { Message, Rule, Rules, UserType } from '@offisito-shared';
import { Types } from 'mongoose';
import { settings } from '../../config';
import { newMessage } from '../../content/email-templates/notifications';
import notificationRuleModel from '../mongo/notifications/notificationRuleModel';
import { sendPushNotification } from '../push';
import pushDeviceModel from '../mongo/notifications/pushDeviceModel';
import { user } from '@auth-backend';
import { conversation, message } from '@chat-backend';
import { TODO } from '@base-shared';
import { sendEmail } from '@email-backend';
import { sidesNames } from '../../api/routes/apiRouter';
const pubSubInstance = require('pubsub-js');

export default () =>
  message()
    .watch()
    .on(
      'change',
      async (data: {
        _id: {
          _data: string;
        };
        operationType: 'insert' | 'update' | string;
        clusterTime: { $timestamp: number };
        wallTime: Date;
        fullDocument: Message;
        ns: { db: 'offisito'; coll: 'messages' };
        documentKey: { _id: Types.ObjectId };
      }) => {
        try {
          pubSubInstance.publish('chats', JSON.stringify(data.clusterTime));
          const User = user(false, false, false);
          if (data.operationType === 'insert') {
            const sender: TODO = await User.findById(
              data?.fullDocument?.ownerId,
            );
            const conv = await conversation(...sidesNames).findById(
              data?.fullDocument?.conversationId,
            );
            const recepient = await User.findById(
              data?.fullDocument?.ownerId === conv.guestId
                ? conv.hostId
                : conv.guestId,
            );
            const domain =
              sender?.userType === UserType.host
                ? (settings.clientDomains as TODO).guest
                : (settings.clientDomains as TODO).host;
            const rule: Rule<{
              conversationId: string;
              domain: string;
            }> = {
              key: Rules.ChatEvent,
              push: {
                payload: {
                  title: sender?.full_name || '',
                  body: data?.fullDocument?.message,
                },
                data: {
                  domain,
                  conversationId: data?.fullDocument?.conversationId,
                },
              },
              email: {
                ...newMessage(
                  sender?.full_name || '',
                  data?.fullDocument?.message,
                  domain + '/chats',
                ),
              },
              sms: {
                message:
                  'New Message from ' +
                  sender?.full_name +
                  ' go to ' +
                  (settings.clientDomains as TODO) +
                  '/chats' +
                  ' to read and repley',
              },
            };
            notificationRuleModel()
              .find()
              .then((subscriptions) =>
                Promise.all(
                  subscriptions.map(async (subscription) => {
                    if (
                      Rules[
                        subscription.key as unknown as keyof typeof Rules
                      ] === rule.key
                    ) {
                      subscription.push &&
                        recepient._id.toString() === subscription.userId &&
                        (
                          await pushDeviceModel().find({
                            userId: subscription.userId,
                          })
                        ).forEach((device) =>
                          sendPushNotification(
                            device.subscription,
                            rule.push.payload,
                            rule.push.data,
                          ),
                        );
                      subscription?.email &&
                        recepient._id.toString() === subscription.userId &&
                        sendEmail(
                          (await User.findById(subscription.userId))?.email ||
                            '',
                          rule.email.subject,
                          rule.email.html,
                        );
                      /* (subscription.sms) && recepient._id.toString() === subscription.userId &&
                       sendSMS();*/
                    }
                  }),
                ),
              )
              .then(() => {
                console.log('All notifications processed successfully.');
              })
              .catch((error) => {
                console.log(
                  'An error occurred while processing notifications:',
                  error,
                );
              });
          }
        } catch (e) {
          console.log('error on new message side effects: ', e);
        }
      },
    );
