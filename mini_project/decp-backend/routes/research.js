const router = require('express').Router();
const { db, admin } = require('../firebase');

router.get('/', async (req, res) => {
  const snapshot = await db.collection('research').orderBy('createdAt', 'desc').get();
  res.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
});

router.post('/', async (req, res) => {
  const doc = await db.collection('research').add({
    ...req.body, members: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ id: doc.id, ...req.body });
});

module.exports = router;