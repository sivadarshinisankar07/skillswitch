// utils/sendPushNotification.js
const { Expo } = require('expo-server-sdk');
const expo = new Expo();


async function sendPushNotification(expoPushToken, { title, body, data, image }) {
  if (!expoPushToken || !Expo.isExpoPushToken(expoPushToken)) {
    console.warn('⚠️ Invalid Expo push token:', expoPushToken);
    return;
  }

  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      // optional rich media
      ...(image && { attachments: [{ url: image }] }),
    };

    const tickets = await expo.sendPushNotificationsAsync([message]);

    console.log('📩 Expo push ticket response:', tickets);

    tickets.forEach((ticket, index) => {
      if (ticket.status === 'ok') {
        console.log(`✅ Notification ${index + 1} sent successfully`);
      } else {
        console.error(`❌ Notification ${index + 1} failed`, ticket);
      }
    });
  } catch (err) {
    console.error('❌ Error sending push notification:', err);
  }
}

module.exports = sendPushNotification;