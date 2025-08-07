const express = require('express');
const router = express.Router();

// TODO: Implement settings CRUD
router.get('/', (req, res) => {
  res.json({ message: 'Settings endpoint TBD' });
});

module.exports = router;