const router = require('express').Router();
const { db, admin } = require('../firebase');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, indexNo, batch, role, email, password } = req.body;
  try {
    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    
    // Save to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name, indexNo, batch, role, email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const token = jwt.sign({ uid: userRecord.uid, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name, indexNo, batch, role } });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use Firebase REST API for login verification
    const fetch = require('node-fetch');
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }) }
    );
    const data = await r.json();
    if (data.error) return res.status(401).json({ error: 'Invalid credentials' });
    
    const userDoc = await db.collection('users').doc(data.localId).get();
    const user = userDoc.data();
    const token = jwt.sign({ uid: data.localId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;