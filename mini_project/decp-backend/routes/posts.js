const router = require('express').Router();
const { db, admin } = require('../firebase');

// GET /api/posts – Get all posts
router.get('/', async (req, res) => {
  const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(posts);
});

// POST /api/posts – Create post
router.post('/', async (req, res) => {
  const { text, authorName, authorBatch, mediaUrl } = req.body;
  const post = {
    text, authorName, authorBatch, mediaUrl: mediaUrl || null,
    likes: 0, comments: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const doc = await db.collection('posts').add(post);
  res.json({ id: doc.id, ...post });
});

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  await db.collection('posts').doc(req.params.id).update({
    likes: admin.firestore.FieldValue.increment(1)
  });
  res.json({ success: true });
});

module.exports = router;