const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
        });
    }
};

exports.getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.status(200).json({
            success: true,
            admin,
        });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin',
        });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(403).json({
                success: false,
                message: 'Admin already exists. Please login.',
            });
        }

        // Create admin
        const admin = await Admin.create({ name, email, password });

        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering admin',
        });
    }
};