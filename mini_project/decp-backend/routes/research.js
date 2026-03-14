const router = require('express').Router();
const { db, admin } = require('../firebase');

// GET /api/research
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('research')
      .orderBy('createdAt', 'desc').get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log('✅ Research fetched:', list.length);
    res.json(list);
  } catch(e) {
    console.error('❌ Research fetch error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/research
router.post('/', async (req, res) => {
  try {
    const { title, field, desc, open, lead, members } = req.body;

    if(!title){
      return res.status(400).json({ error: 'Title is required' });
    }

    const project = {
      title: title || '',
      field: field || 'General',
      desc: desc || '',
      open: open !== false,
      lead: lead || 'Unknown',
      members: members || 1,
      collaborators: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const doc = await db.collection('research').add(project);
    console.log('✅ Research saved:', doc.id, title);
    res.json({ id: doc.id, ...project });

  } catch(e) {
    console.error('❌ Research save error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/research/:id/join
router.post('/:id/join', async (req, res) => {
  try {
    const { name } = req.body;
    await db.collection('research').doc(req.params.id).update({
      members: admin.firestore.FieldValue.increment(1),
      collaborators: admin.firestore.FieldValue.arrayUnion(name || 'Unknown')
    });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;