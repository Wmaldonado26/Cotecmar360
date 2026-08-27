const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');
const landingController = require('../controllers/landing.controller');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'landing_cards',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

router.get('/', landingController.getCards);
router.post('/', requireAuth, requireRole('admin', 'project_admin'), upload.fields([{ name: 'image', maxCount: 1 }]), landingController.createCard);
router.put('/:id', requireAuth, requireRole('admin', 'project_admin'), upload.fields([{ name: 'image', maxCount: 1 }]), landingController.updateCard);
router.delete('/:id', requireAuth, requireRole('admin', 'project_admin'), landingController.deleteCard);
router.post('/translate', requireAuth, requireRole('admin', 'project_admin'), landingController.translateContent);

module.exports = router;
