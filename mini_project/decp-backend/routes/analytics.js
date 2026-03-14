const router = require('express').Router();
const { db } = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const [postsSnap, jobsSnap, researchSnap, usersSnap] = await Promise.all([
      db.collection('posts').get(),
      db.collection('jobs').get(),
      db.collection('research').get(),
      db.collection('users').get()
    ]);

    const openJobs = jobsSnap.docs.filter(d =>
      d.data().status !== 'closed'
    ).length;

    console.log('📊 Analytics:', {
      posts: postsSnap.size,
      jobs: jobsSnap.size,
      research: researchSnap.size,
      users: usersSnap.size
    });

    res.json({
      totalPosts:       postsSnap.size,
      totalJobs:        jobsSnap.size,
      openJobs:         openJobs,
      researchProjects: researchSnap.size,
      totalUsers:       usersSnap.size
    });

  } catch(e) {
    console.error('❌ Analytics error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;