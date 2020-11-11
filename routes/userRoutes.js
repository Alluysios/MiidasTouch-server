const express = require('express');
const parser = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.put('/addProfileImage', parser.single('profileImage'), userController.addProfileImage);
router.put('/updateProfile', userController.updateProfile);
router.put('/changePassword', userController.changePassword);

module.exports = router;