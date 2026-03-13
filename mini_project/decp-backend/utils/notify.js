// utils/notify.js
const { db } = require('../firebase');
const webpush = require('web-push');

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@ce.pdn.ac.lk',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendNotificationToAll({ title, body, url }){
  try {
    const snapshot = await db.collection('pushSubscriptions').get();
    const payload = JSON.stringify({ title, body, url: url || '/' });

    await Promise.allSettled(
      snapshot.docs.map(doc =>
        webpush.sendNotification(doc.data().subscription, payload)
          .catch(async (err) => {
            // Remove expired subscriptions
            if(err.statusCode === 410){
              await doc.ref.delete();
            }
          })
      )
    );
    console.log(`📢 Notified ${snapshot.size} subscribers: ${title}`);
  } catch(e) {
    console.error('Notification error:', e.message);
  }
}

module.exports = { sendNotificationToAll };