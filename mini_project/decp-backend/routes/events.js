const router = require('express').Router();
const { db, admin } = require('../firebase');

router.get('/', async (req, res) => {
  const snapshot = await db.collection('events').orderBy('date', 'asc').get();
  res.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const event = { ...req.body, rsvpCount: 0, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  const doc = await db.collection('events').add(event);
  res.json({ id: doc.id, ...event });
});

router.post('/:id/rsvp', async (req, res) => {
  await db.collection('events').doc(req.params.id).update({ rsvpCount: admin.firestore.FieldValue.increment(1) });
  res.json({ success: true });
});

module.exports = router;