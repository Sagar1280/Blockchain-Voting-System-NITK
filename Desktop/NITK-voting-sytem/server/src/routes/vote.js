import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
const router = express.Router();

// Client records that the user has voted (after successful on-chain tx)
router.post('/record', auth, async (req, res) => {
  try {
    const { roll } = req.body;
    const user = await User.findOne({ roll });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.hasVoted) return res.status(400).json({ error: 'Already recorded' });
    user.hasVoted = true;
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: get voter list (no choices)
router.get('/voters', async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0, __v: 0 }).limit(3000);
    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
