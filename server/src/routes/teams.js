const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { Team } = require('../models');
const adminAuth = require('../middleware/adminAuth');

// Public: list all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create team
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, link } = req.body;
    const team = await Team.create({ name, link });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update team
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ message: 'Not found' });
    await team.update(updates);
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete team
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ message: 'Not found' });
    await team.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate limiter: 1 click per team per IP (30 days)
const clickLimiter = rateLimit({
  windowMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  max: 1,
  keyGenerator: (req) => `${req.ip}-${req.params.id}`,
  message: { message: 'Anda sudah mengambil link tim ini.' },
});

// Public: click team link (increments count)
router.post('/:id/click', clickLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.status === 'penuh' || team.click_count >= 100) {
      return res.status(400).json({ message: 'Tim penuh' });
    }

    await team.increment('click_count');
    if (team.click_count + 1 >= 100) {
      await team.update({ status: 'penuh' });
    }
    res.json({ link: team.link, message: 'Berhasil bergabung!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reset click counts (all teams)
router.post('/reset/all', adminAuth, async (req, res) => {
  try {
    await Team.update({ click_count: 0, status: 'aktif' }, { where: {} });
    res.json({ message: 'Reset berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;