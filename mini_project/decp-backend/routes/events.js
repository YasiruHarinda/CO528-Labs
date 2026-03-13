const router = require('express').Router();
const { db, admin } = require('../firebase');
const axios = require('axios');

// GET /api/events — proxy CE portal (avoids CORS) + fallback to Firestore
router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://portal.ce.pdn.ac.lk/api/events/v2/');
    res.json(response.data);
  } catch (err) {
    // CE API failed — return events from Firestore instead
    const snap = await db.collection('events').orderBy('createdAt','desc').get();
    const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(events);
  }
});

// POST /api/events — save new event
router.post('/', async (req, res) => {
  try {
    const doc = await db.collection('events').add({
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: doc.id, ...req.body });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;