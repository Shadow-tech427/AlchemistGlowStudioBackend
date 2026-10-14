const Appointment = require('../models/Appointment');
const { sendWhatsAppMessages } = require('../services/whatsappService');

exports.createAppointment = async (req, res) => {
    try {
        const { userName, userPhone, serviceName, bookingDate, bookingTime, notes } = req.body;

        // Validate required fields
        if (!userName || !userPhone || !serviceName || !bookingDate || !bookingTime) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled',
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            userName,
            userPhone,
            serviceName,
            bookingDate: new Date(bookingDate),
            bookingTime,
            status: 'confirmed',
            notes,
        });

        // Send WhatsApp messages (non-blocking)
        sendWhatsAppMessages(appointment).catch(err =>
            console.error('WhatsApp send failed:', err.message)
        );

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment,
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message,
        });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = (await Appointment.find()).sort({ createdAt: -1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
        });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
        });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true, runValidators: true }
        );
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment,
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
        });
    }
};