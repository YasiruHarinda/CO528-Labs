const router = require('express').Router();
const { db } = require('../firebase');

router.get('/', async (req, res) => {
  try {
    const [postsSnap, jobsSnap, researchSnap, usersSnap, appsSnap] = await Promise.all([
      db.collection('posts').get(),
      db.collection('jobs').get(),
      db.collection('research').get(),
      db.collection('users').get(),
      db.collection('applications').get()
    ]);

    res.json({
      totalPosts:          postsSnap.size,
      totalJobs:           jobsSnap.size,
      openJobs:            jobsSnap.docs.filter(d => d.data().status !== 'closed').length,
      researchProjects:    researchSnap.size,
      totalUsers:          usersSnap.size,
      totalApplications:   appsSnap.size
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;