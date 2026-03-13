const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/research', require('./routes/research'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/', (req, res) => res.json({ 
  status: 'DECP API running', 
  version: '1.0' 
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DECP API on port ${PORT}`));