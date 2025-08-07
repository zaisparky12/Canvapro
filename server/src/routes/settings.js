const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const adminAuth = require('../middleware/adminAuth');

// Public: get settings (first row)
router.get('/', async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: upsert settings
router.post('/', adminAuth, async (req, res) => {
  try {
    const { qris_url, rekening, admin_contact } = req.body;
    let setting = await Setting.findOne();
    if (setting) {
      await setting.update({ qris_url, rekening, admin_contact });
    } else {
      setting = await Setting.create({ qris_url, rekening, admin_contact });
    }
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;