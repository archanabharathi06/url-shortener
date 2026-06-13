const express = require('express');
const redirectController = require('../controllers/redirect.controller');

const router = express.Router();

// Redirect route at root level
router.get('/:shortCode', redirectController.handleRedirect);

module.exports = router;
