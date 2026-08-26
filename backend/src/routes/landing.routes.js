const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
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
router.post('/', authMiddleware, roleMiddleware(['admin', 'project_admin']), upload.fields([{ name: 'image', maxCount: 1 }]), landingController.createCard);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'project_admin']), upload.fields([{ name: 'image', maxCount: 1 }]), landingController.updateCard);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'project_admin']), landingController.deleteCard);
router.post('/translate', authMiddleware, roleMiddleware(['admin', 'project_admin']), landingController.translateContent);

module.exports = router;
