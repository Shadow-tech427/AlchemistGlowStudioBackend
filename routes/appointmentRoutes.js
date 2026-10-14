const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Public route - create appointment
router.post('/', createAppointment);

// Protected routes - admin only
router.get('/', protect, getAllAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;