
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'musicappsecret';

// Connect to MongoDB. MONGO_URI must be provided in .env
const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

async function initDB() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

initDB().then(() => {

  // Define Mongoose schemas
  const UserModel = new mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    favourites: [String],
    playlists: [{ name: String, songs: [String] }]
  }));

  // Helpers for DB ops
  const findUserByEmail = async (email) => {
    return await UserModel.findOne({ email }).lean();
  };

  const saveUser = async (user) => {
    const created = await UserModel.create(user);
    return created.toObject();
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (await findUserByEmail(email)) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashed, favourites: [], playlists: [] };
    const saved = await saveUser(user);
    const token = jwt.sign({ id: saved._id, email: saved.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: saved.name, email: saved.email, id: saved._id } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
  });

  // Middleware to protect routes
  const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Songs route (static list from data/songs.js)
  app.get('/api/songs', (req, res) => {
    const songs = require('./data/songs');
    res.json(songs);
  });

  // Favourites routes
  app.post('/api/favourites/toggle', auth, async (req, res) => {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: 'Missing songId' });
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const idx = user.favourites.indexOf(songId);
    if (idx === -1) user.favourites.push(songId); else user.favourites.splice(idx,1);
    await user.save();
    return res.json({ favourites: user.favourites });
  });

  // Playlist routes
  app.post('/api/playlists', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Missing name' });
    const user = await UserModel.findById(req.user.id);
    user.playlists.push({ name, songs: [] });
    await user.save();
    return res.json({ playlists: user.playlists });
  });

  app.post('/api/playlists/add', auth, async (req, res) => {
    const { playlistIndex, songId } = req.body;
    if (playlistIndex === undefined || !songId) return res.status(400).json({ message: 'Missing data' });
    const user = await UserModel.findById(req.user.id);
    if (!user.playlists[playlistIndex]) return res.status(404).json({ message: 'Playlist not found' });
    user.playlists[playlistIndex].songs.push(songId);
    await user.save();
    return res.json({ playlists: user.playlists });
  });

  // Profile
  app.get('/api/profile', auth, async (req, res) => {
    const user = await UserModel.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ name: user.name, email: user.email, favourites: user.favourites, playlists: user.playlists });
  });

  // Add a simple root route to check if the server is running
  app.get('/', (req, res) => {
    res.send('Music App Backend is running!');
  });

  // Serve frontend static files if built (optional)
  app.use('/songs', express.static(path.join(__dirname, 'public', 'songs')));
  app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
