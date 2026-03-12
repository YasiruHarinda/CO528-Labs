const router = require('express').Router();
const { db, admin } = require('../firebase');
const jwt = require('jsonwebtoken');

// Helper — convert index number to email
// E/20/089 → e20089@eng.pdn.ac.lk
function indexToEmail(indexNo) {
  return indexNo.replace(/\//g, '').toLowerCase() + '@eng.pdn.ac.lk';
}

// ─────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, indexNo, batch, role, password } = req.body;

  // Validation
  if (!name || !indexNo || !password) {
    return res.status(400).json({ 
      error: 'Name, index number and password are required' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters' 
    });
  }

  const email = indexToEmail(indexNo);

  try {
    // Check if index number already registered
    const existing = await db.collection('users')
      .where('indexNo', '==', indexNo)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ 
        error: 'An account already exists for this index number. Please login.' 
      });
    }

    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Save user profile to Firestore
    const userData = {
      name,
      indexNo,
      batch: batch || 'Unknown',
      role: role || 'student',
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Generate JWT token
    const token = jwt.sign(
      { uid: userRecord.uid, role: userData.role },
      process.env.JWT_SECRET || 'decp_secret_fallback',
      { expiresIn: '7d' }
    );

    console.log('✅ Registered:', indexNo, '→', email);

    res.json({
      token,
      user: {
        name,
        indexNo,
        batch: userData.batch,
        role: userData.role,
        email,
        uid: userRecord.uid
      }
    });

  } catch (e) {
    console.error('❌ Register error:', e.message);

    if (e.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        error: 'Account already exists. Please login instead.' 
      });
    }
    if (e.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        error: 'Invalid index number format.' 
      });
    }
    if (e.code === 'auth/weak-password') {
      return res.status(400).json({ 
        error: 'Password is too weak. Use at least 6 characters.' 
      });
    }

    res.status(500).json({ error: 'Registration failed: ' + e.message });
  }
});

// ─────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Index number and password are required' 
    });
  }

  try {
    // Verify credentials with Firebase REST API
    const firebaseResp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    const firebaseData = await firebaseResp.json();

    // Firebase returned an error
    if (firebaseData.error) {
      console.error('❌ Firebase login error:', firebaseData.error.message);

      if (firebaseData.error.message === 'EMAIL_NOT_FOUND') {
        return res.status(401).json({ 
          error: 'No account found for this index number. Please register first.' 
        });
      }
      if (firebaseData.error.message === 'INVALID_PASSWORD') {
        return res.status(401).json({ 
          error: 'Wrong password. Please try again.' 
        });
      }
      if (firebaseData.error.message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        return res.status(429).json({ 
          error: 'Too many failed attempts. Please try again later.' 
        });
      }

      return res.status(401).json({ 
        error: 'Wrong index number or password.' 
      });
    }

    // Get user profile from Firestore
    const userDoc = await db.collection('users')
      .doc(firebaseData.localId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ 
        error: 'User profile not found. Please register again.' 
      });
    }

    const user = userDoc.data();

    // Generate JWT token
    const token = jwt.sign(
      { uid: firebaseData.localId, role: user.role },
      process.env.JWT_SECRET || 'decp_secret_fallback',
      { expiresIn: '7d' }
    );

    console.log('✅ Logged in:', user.indexNo);

    res.json({
      token,
      user: {
        name: user.name,
        indexNo: user.indexNo,
        batch: user.batch,
        role: user.role,
        email: user.email,
        uid: firebaseData.localId
      }
    });

  } catch (e) {
    console.error('❌ Login error:', e.message);
    res.status(500).json({ error: 'Server error: ' + e.message });
  }
});

// ─────────────────────────────────────
// GET /api/auth/me — get current user
// ─────────────────────────────────────
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'decp_secret_fallback'
    );

    const userDoc = await db.collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userDoc.data() });

  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;