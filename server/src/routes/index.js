const express = require('express');
const router = express.Router();

// Placeholder sub-routes
router.use('/teams', require('./teams'));
router.use('/orders', require('./orders'));
router.use('/settings', require('./settings'));
router.use('/stats', require('./stats'));

module.exports = router;