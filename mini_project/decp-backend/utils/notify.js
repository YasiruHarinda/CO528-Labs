const { db } = require('../firebase');
const webpush = require('web-push');

// Setup called inside function, NOT at top level
function getWebPush(){
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@ce.pdn.ac.lk',
    process.env.VAPID_PUBLIC_KEY || '',
    process.env.VAPID_PRIVATE_KEY || ''
  );
  return webpush;
}

async function sendNotificationToAll({ title, body, url }){
  // Skip if VAPID keys not configured
  if(!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY){
    console.log('⚠️ VAPID keys not set, skipping notification');
    return;
  }

  try {
    const push = getWebPush();
    const snapshot = await db.collection('pushSubscriptions').get();
    const payload = JSON.stringify({ title, body, url: url || '/' });

    await Promise.allSettled(
      snapshot.docs.map(doc =>
        push.sendNotification(doc.data().subscription, payload)
          .catch(async (err) => {
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