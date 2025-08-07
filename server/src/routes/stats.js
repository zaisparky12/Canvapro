const express = require('express');
const router = express.Router();
const { User, Order } = require('../models');
const { Op } = require('sequelize');
const adminAuth = require('../middleware/adminAuth');

// Admin: summary stats
router.get('/', adminAuth, async (req, res) => {
  try {
    const [vipTotal] = await User.count({ where: { type: 'vip' } });
    const [gratisTotal] = await User.count({ where: { type: 'gratis' } });

    // daily stats (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vipToday = await User.count({ where: { type: 'vip', joined_at: { [Op.gte]: today } } });
    const gratisToday = await User.count({ where: { type: 'gratis', joined_at: { [Op.gte]: today } } });

    res.json({ vipTotal, gratisTotal, vipToday, gratisToday });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: last 10 members
router.get('/latest', async (req, res) => {
  try {
    const members = await User.findAll({ order: [['joined_at', 'DESC']], limit: 10 });
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;