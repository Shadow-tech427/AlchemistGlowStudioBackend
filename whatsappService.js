const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Send WhatsApp messages
const sendWhatsAppMessages = async (appointment) => {
    try {
        // Format date
        const formattedDate = new Date(appointment.bookingDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        // Message to User
        const userMessage = `Booking Confirmation - Alchemist Glow Studio
        Hello ${appointment.userName}, your appointment is confirmed!
        
        Service: ${appointment.serviceName}
        Date: ${formattedDate}
        Time: ${appointment.bookingTime}
        Location: Alchemist Glow Studio
        Contact: +91 9356434353
        
        We look forward to welcoming you!`.trim();

        // Message to Admin
        const adminMessage = `New Appointment Alert!
        
        Client: ${appointment.userName}
        Phone: ${appointment.userPhone}
        Service: ${appointment.serviceName}
        Date: ${formattedDate}
        Time: ${appointment.bookingTime}
        
        Please confirm the appointment.`.trim();

        // Send message to user
        if (appointment.userPhone) {
            await twilioClient.messages.create({
                body: userMessage,
                from: process.env.TWILIO_WHATSAPP_FROM,
                to: `whatsapp:${appointment.userPhone}`,
            });
            console.log('Whatsapp message sent to user:', appointment.userPhone);
        }

        // Send message to admin
        await twilioClient.messages.create({
            body: adminMessage,
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:${process.env.ADMIN_PHONE}`,
        });
        console.log('Whatsapp message sent to admin');

        return { success: true };
    } catch (error) {
        console.error('Error sending WhatsApp messages:', error.message);
        // Don't throw error - booking should still be saved even if WhatsApp fails
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMessages };