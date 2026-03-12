const router = require('express').Router();
const { db } = require('../firebase');
const fetch = require('node-fetch');

// GET /api/analytics – Live stats from CE API + own DB
router.get('/', async (req, res) => {
  const [postsSnap, jobsSnap, eventsSnap, researchSnap] = await Promise.all([
    db.collection('posts').get(),
    db.collection('jobs').get(),
    db.collection('events').get(),
    db.collection('research').get()
  ]);
  
  // Fetch batch counts from CE dept API
  const ceIndex = await fetch('https://api.ce.pdn.ac.lk/people/v1/students/').then(r => r.json()).catch(() => ({}));
  
  res.json({
    totalPosts: postsSnap.size,
    openJobs: jobsSnap.size,
    upcomingEvents: eventsSnap.size,
    researchProjects: researchSnap.size,
    memberBatches: ceIndex
  });
});

module.exports = router;