const rateLimit = require('express-rate-limit');

// Daily rate limiter: 100 requrests per 24 hours per IP
const apiDailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours in miliseconds
    max: 100, // Limit each IP to 100 requests per 24-hour window
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Daily request limit reached (100 requests/day). Please try again tomorrow.'
    }
});

// Stricter limiter for Auth endpoints (e.g. login/register) to stop mobile spam attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 10, // Max 10 attempts per 15 mins
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.'
    }
});

module.exports = { apiDailyLimiter, authLimiter };