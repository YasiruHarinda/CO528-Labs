const router = require('express').Router();
const { db, admin } = require('../firebase');


// GET /api/messages?userId=xxx
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if(!userId) return res.json([]);
  try {
    // No orderBy — avoids needing composite index
    const snap = await db.collection('messages')
      .where('participants', 'array-contains', userId)
      .get();
    const convos = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const aTime = a.lastMessageAt?._seconds || 0;
        const bTime = b.lastMessageAt?._seconds || 0;
        return bTime - aTime;
      });
    res.json(convos);
  } catch(e) {
    console.error('Messages error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/messages/:convoId/thread
router.get('/:convoId/thread', async (req, res) => {
  const cleanToId = toId.replace(/\//g, '-');
const cleanFromId = fromId.replace(/\//g, '-');
const convoId = [cleanFromId, cleanToId].sort().join('_');
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

// POST /api/messages/send
router.post('/send', async (req, res) => {
  const { fromId, fromName, fromAvatar, toId, toName, text } = req.body;
  if(!fromId || !toId || !text){
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const convoId = [fromId, toId].sort().join('_');
    const convoRef = db.collection('messages').doc(convoId);
    await convoRef.set({
      participants: [fromId, toId],
      names: { [fromId]: fromName, [toId]: toName },
      lastMessage: text,
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSenderId: fromId
    }, { merge: true });
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