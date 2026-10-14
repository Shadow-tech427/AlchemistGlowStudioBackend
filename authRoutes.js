const express = require('express');
const router = express.Router();
const {
    adminLogin,
    getCurrentAdmin,
    registerAdmin,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/admin/login', adminLogin);
router.post('/admin/register', registerAdmin);

// Protected route
router.get('/admin/me', protect, getCurrentAdmin);

module.exports = router;