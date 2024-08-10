import { Booking, RequestStatus, Rule, Rules } from '@offisito-shared';
import { Types } from 'mongoose';
import { newBooking } from '../../content/email-templates/notifications';
import notificationRuleModel from '../mongo/notifications/notificationRuleModel';
import { sendPushNotification } from '../push';
import pushDeviceModel from '../mongo/notifications/pushDeviceModel';
import bookingModel from '../mongo/bookings/bookingModel';
import { user } from '@auth-backend';
import { TODO } from '@base-shared';
import { settings } from '../../config';
import { sendEmail } from '@email-backend';

export default () =>
  bookingModel()
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
        fullDocument: Booking;
        ns: { db: 'offisito'; coll: 'bookings' };
        documentKey: { _id: Types.ObjectId };
      }) => {
        try {
          PubSub.publish('bookings', JSON.stringify(data.clusterTime));
          const User = user(false, false, false);
          if (data?.fullDocument?.requestStatus === RequestStatus.Offer) {
            const guestThatSent: TODO = await User.findById(
              data?.fullDocument?.guest.toString(),
            );
            const rule: Rule<null> = {
              key: Rules.ChatEvent,
              push: {
                payload: {
                  title: guestThatSent?.full_name || '',
                  body:
                    'New booking request' + data?.fullDocument?.note
                      ? ': ' + data?.fullDocument?.note
                      : '',
                },
                data: null,
              },
              email: {
                ...newBooking(
                  guestThatSent?.full_name || '',
                  data?.fullDocument?.note || '',
                  (settings.clientDomains as TODO).host,
                ),
              },
              sms: {
                message:
                  'New Message from ' + guestThatSent?.full_name ||
                  '' +
                    ' go to ' +
                    (settings.clientDomains as TODO).host +
                    '/dashboard' +
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
                        (
                          await pushDeviceModel().find({
                            userId: subscription.userId,
                          })
                        ).forEach((device) =>
                          sendPushNotification(
                            device.subscription,
                            rule?.push?.payload,
                            rule?.push?.data,
                          ),
                        );
                      subscription.email &&
                        sendEmail(
                          (await User.findById(subscription.userId))?.email ||
                            '',
                          rule?.email?.subject,
                          rule?.email?.html,
                        );
                      /* (subscription.email) &&
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
