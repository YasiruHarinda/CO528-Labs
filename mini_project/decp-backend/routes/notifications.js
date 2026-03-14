const router = require('express').Router();
const { db, admin } = require('../firebase');
const webpush = require('web-push');

// Setup VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@ce.pdn.ac.lk',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// POST /api/notifications/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, userId, userName, endpoint } = req.body;

    if(!subscription || !subscription.endpoint){
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    // ✅ Check if this endpoint already exists — don't save duplicate
    const existing = await db.collection('pushSubscriptions')
      .where('endpoint', '==', subscription.endpoint)
      .get();

    if(!existing.empty){
      console.log('⚠️ Subscription already exists, skipping');
      return res.json({ success: true, duplicate: true });
    }

    // Save new subscription
    await db.collection('pushSubscriptions').add({
      subscription,
      endpoint: subscription.endpoint,   // ← save endpoint for dedup check
      userId: userId || 'anonymous',
      userName: userName || 'Unknown',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Push subscription saved for:', userName);
    res.json({ success: true });

  } catch(e) {
    console.error('❌ Subscribe error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/notifications/send
// Send push notification to ALL subscribers
router.post('/send', async (req, res) => {
  try {
    const { title, body, url } = req.body;

    // Get all subscriptions
    const snapshot = await db.collection('pushSubscriptions').get();
    const subscriptions = snapshot.docs.map(d => d.data().subscription);

    console.log(`📢 Sending to ${subscriptions.length} subscribers`);

    const payload = JSON.stringify({ title, body, url });

    // Send to all subscribers in parallel
    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(sub, payload)
      )
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Sent: ${sent}, Failed: ${failed}`);
    res.json({ sent, failed });

  } catch(e) {
    console.error('❌ Send error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/notifications/vapidkey
// Frontend needs public key to subscribe
router.get('/vapidkey', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;