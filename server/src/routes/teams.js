const express = require('express');
const router = express.Router();

// TODO: Implement teams CRUD and click logic
router.get('/', (req, res) => {
  res.json({ message: 'Teams endpoint TBD' });
});

module.exports = router;