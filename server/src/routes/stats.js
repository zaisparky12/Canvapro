const express = require('express');
const router = express.Router();

// TODO: Implement statistics analysis
router.get('/', (req, res) => {
  res.json({ message: 'Stats endpoint TBD' });
});

module.exports = router;