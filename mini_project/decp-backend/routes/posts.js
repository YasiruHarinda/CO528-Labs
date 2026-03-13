const router = require('express').Router();
const { db, admin } = require('../firebase');
const { sendNotificationToAll } = require('../utils/notify')

// GET /api/posts – Get all posts
router.get('/', async (req, res) => {
  const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').limit(20).get();
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(posts);
});

// POST /api/posts – Create post
// POST /api/posts
router.post('/', async (req, res) => {
  try {
    const { text, authorName, authorBatch, mediaUrl, mediaType } = req.body;
    const post = {
      text: text || '',
      authorName: authorName || 'CE Student',
      authorBatch: authorBatch || '',
      mediaUrl: mediaUrl || null,    // ← save photo URL
      mediaType: mediaType || null,  // ← save media type
      likes: 0,
      comments: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const doc = await db.collection('posts').add(post);
    console.log('✅ Post saved:', doc.id, mediaUrl ? 'with media' : 'text only');
    // Send notification to all subscribers
    sendNotificationToAll({
      title: `📰 New post by ${authorName}`,
      body: text.slice(0, 80),
      url: '/'
    }).catch(() => {}); 
    res.json({ id: doc.id, ...post });
  } catch(e) {
    console.error('❌ Post error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  await db.collection('posts').doc(req.params.id).update({
    likes: admin.firestore.FieldValue.increment(1)
  });
  res.json({ success: true });
});

// POST /api/posts/:id/comment
router.post('/:id/comment', async (req, res) => {
  const { author, text } = req.body;
  try {
    await db.collection('posts').doc(req.params.id).update({
      comments: admin.firestore.FieldValue.increment(1)
    });
    await db.collection('comments').add({
      postId: req.params.id,
      author, text,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;