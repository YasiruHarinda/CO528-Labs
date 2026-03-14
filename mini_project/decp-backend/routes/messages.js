const router = require('express').Router();
const { db, admin } = require('../firebase');

// GET /api/messages?userId=xxx — get all conversations for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json([]);

  try {
    const snap = await db.collection('messages')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageAt', 'desc')
      .get();

    const convos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(convos);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/messages/:convoId/thread — get messages in a conversation
router.get('/:convoId/thread', async (req, res) => {
  try {
    const snap = await db.collection('messages')
      .doc(req.params.convoId)
      .collection('thread')
      .orderBy('sentAt', 'asc')
      .get();

    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/messages/send — send a message
router.post('/send', async (req, res) => {
  const { fromId, fromName, fromAvatar, toId, toName, text } = req.body;
  if (!fromId || !toId || !text) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Conversation ID — always same regardless of who initiates
    const convoId = [fromId, toId].sort().join('_');
    const convoRef = db.collection('messages').doc(convoId);

    // Create or update conversation doc
    await convoRef.set({
      participants: [fromId, toId],
      names: { [fromId]: fromName, [toId]: toName },
      avatars: { [fromId]: fromAvatar || '?' },
      lastMessage: text,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSenderId: fromId
    }, { merge: true });

    // Add message to thread
    await convoRef.collection('thread').add({
      fromId, fromName,
      text,
      sentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, convoId });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;