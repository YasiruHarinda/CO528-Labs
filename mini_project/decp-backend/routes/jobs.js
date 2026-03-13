const router = require('express').Router();
const { db, admin } = require('../firebase');

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('jobs')
      .orderBy('createdAt', 'desc').get();
    const jobs = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    console.log('✅ Jobs fetched:', jobs.length);
    res.json(jobs);
  } catch(e) {
    console.error('❌ Jobs fetch error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const { 
      title, company, location, type, 
      desc, tags, deadline, applyUrl 
    } = req.body;

    if(!title || !company){
      return res.status(400).json({ 
        error: 'Title and company are required' 
      });
    }

    const job = {
      title: title || '',
      company: company || '',
      location: location || 'Sri Lanka',
      type: type || 'fulltime',
      desc: desc || '',
      tags: tags || [],
      deadline: deadline || '',
      applyUrl: applyUrl || '',
      applications: 0,
      status: 'open',
      postedBy: req.body.postedBy || 'Alumni',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const doc = await db.collection('jobs').add(job);
    console.log('✅ Job saved:', doc.id, title);
    res.json({ id: doc.id, ...job });

  } catch(e) {
    console.error('❌ Job save error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/jobs/:id/apply
router.post('/:id/apply', async (req, res) => {
  try {
    await db.collection('jobs').doc(req.params.id).update({
      applications: admin.firestore.FieldValue.increment(1)
    });
    await db.collection('applications').add({
      jobId: req.params.id,
      applicantName: req.body.name || 'Anonymous',
      applicantIndex: req.body.indexNo || '',
      appliedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('jobs').doc(req.params.id).delete();
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;