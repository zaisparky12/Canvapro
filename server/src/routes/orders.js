const express = require('express');
const router = express.Router();

// TODO: Implement orders CRUD and VIP approval
router.get('/', (req, res) => {
  res.json({ message: 'Orders endpoint TBD' });
});

module.exports = router;