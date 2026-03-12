const router = require('express').Router();
const { db, admin } = require('../firebase');

// GET /api/jobs
router.get('/', async (req, res) => {
  let query = db.collection('jobs').orderBy('createdAt', 'desc');
  if (req.query.type) query = query.where('type', '==', req.query.type);
  const snapshot = await query.get();
  res.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
});

// POST /api/jobs
router.post('/', async (req, res) => {
  const job = { ...req.body, applications: 0, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  const doc = await db.collection('jobs').add(job);
  res.json({ id: doc.id, ...job });
});

// POST /api/jobs/:id/apply
router.post('/:id/apply', async (req, res) => {
  await db.collection('applications').add({
    jobId: req.params.id,
    applicantName: req.body.name,
    appliedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  await db.collection('jobs').doc(req.params.id).update({ applications: admin.firestore.FieldValue.increment(1) });
  res.json({ success: true });
});

module.exports = router;