const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    userPhone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
    },
    bookingDate: {
        type: String,
        required: [true, 'Booking date is requied'],
    },
    bookingTime: {
        type: String,
        required: [true, 'Booking time is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Index for faster queries
appointmentSchema.index({ bookingDate: 1, bookingTime: 1 });
appointmentSchema.index({ userPhone: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);