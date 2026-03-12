const router = require('express').Router();
const { db, admin } = require('../firebase');

router.get('/:userId', async (req, res) => {
  const snapshot = await db.collection('messages')
    .where('participants', 'array-contains', req.params.userId)
    .orderBy('createdAt', 'desc').get();
  res.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const doc = await db.collection('messages').add({
    ...req.body,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ id: doc.id });
});

module.exports = router;