const router = require('express').Router();
const { db } = require('../firebase');

router.get('/', async (req, res) => {
  try {
    // Count all collections in parallel
    const [
      postsSnap,
      jobsSnap,
      eventsSnap,
      researchSnap,
      usersSnap,
      applicationsSnap
    ] = await Promise.all([
      db.collection('posts').get(),
      db.collection('jobs').get(),
      db.collection('events').get(),
      db.collection('research').get(),
      db.collection('users').get(),
      db.collection('applications').get()
    ]);

    // Count open jobs specifically
    const openJobs = jobsSnap.docs.filter(d => {
      const data = d.data();
      return data.status !== 'closed'; // count all unless marked closed
    }).length;

    console.log('📊 Analytics:', {
      posts: postsSnap.size,
      jobs: jobsSnap.size,
      openJobs,
      events: eventsSnap.size,
      research: researchSnap.size,
      users: usersSnap.size
    });

    res.json({
      totalPosts: postsSnap.size,
      totalJobs: jobsSnap.size,
      openJobs: openJobs,
      upcomingEvents: eventsSnap.size,
      researchProjects: researchSnap.size,
      totalUsers: usersSnap.size,
      totalApplications: applicationsSnap.size
    });

  } catch(e) {
    console.error('❌ Analytics error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;