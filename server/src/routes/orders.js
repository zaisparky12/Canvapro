const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Order, User, Team } = require('../models');
const adminAuth = require('../middleware/adminAuth');
const { transporter } = require('../utils/email');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Public: create order (upload proof)
router.post('/', upload.single('bukti'), async (req, res) => {
  try {
    const { email, paket } = req.body;
    if (!email || !paket) return res.status(400).json({ message: 'Invalid' });

    const bukti_url = req.file ? `/uploads/${req.file.filename}` : null;
    const order = await Order.create({ email, paket, bukti_url });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list orders
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper send email
async function sendVipEmail(email, teamLink) {
  const info = await transporter.sendMail({
    from: `Canva Pro ID <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Link Tim Canva Pro VIP',
    html: `<p>Selamat! Berikut link tim Canva Pro VIP Anda:</p><p><a href="${teamLink}">${teamLink}</a></p>`,
  });
  console.log('Email sent', info.messageId);
}

// Admin: approve order
router.put('/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Not found' });

    await order.update({ status: 'approved' });

    // Upsert user
    let user = await User.findOne({ where: { email: order.email } });
    if (user) {
      await user.update({ type: 'vip' });
    } else {
      user = await User.create({ email: order.email, type: 'vip' });
    }

    // Choose first available team link
    const team = await Team.findOne({ where: { status: 'aktif' }, order: [['click_count', 'ASC']] });
    const teamLink = team ? team.link : 'akan dikirim menyusul';

    // Send email
    await sendVipEmail(order.email, teamLink);

    res.json({ message: 'Approved & email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: reject order
router.put('/:id/reject', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    await order.update({ status: 'rejected' });
    res.json({ message: 'Order rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;