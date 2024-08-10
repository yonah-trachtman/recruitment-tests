import webpush from 'web-push';
import { settings } from '../../config';
import { TODO } from '@base-shared';
import { StagingEnvironment } from '@base-backend';

const vapidKeys = {
  publicKey:
    settings.stagingEnv === StagingEnvironment.Prod
      ? 'BJtmovBK-alweZASAsp4tEs2pIvGFL8aqM5wNYH_SSFQXJI4Zs4Hu16lHIdC9Tbaeblqwj_se9TsZnpHdKJ5L7I'
      : 'BMthjMSqVzZ_qNNYDJq2N8f1xhn_ZdyBOMUJ97-kz9Tbnmb_AfK43eESJNzEX_PcZK0f1993GUlv7Io_7vIf4tY',
  privateKey: settings.push,
};

webpush.setVapidDetails(
  'mailto:michael@offisito.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey ||
    (() => {
      throw new Error('No private key set');
    })(),
);

export const sendPushNotification = async <D extends { domain: string }>(
  subscription: TODO,
  payload: { title: string; body: string },
  data: D,
) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ ...payload, ...data }),
    );
    console.log('Notification sent successfully.');
  } catch (error) {
    console.log('Error sending notification:', error);
  }
};
