const express = require('express');
const urlController = require('../controllers/url.controller');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const { urlCreationLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Apply auth protection globally to all URL routes
router.use(protect);

router.get('/', urlController.getUrls);
router.post('/', urlCreationLimiter, validate(urlController.createUrlSchema), urlController.createUrl);
router.patch('/:id', validate(urlController.updateUrlSchema), urlController.updateUrlById);
router.delete('/:id', validate(urlController.deleteUrlSchema), urlController.deleteUrlById);
router.get('/:id/qr', urlController.getQrCode);

module.exports = router;
