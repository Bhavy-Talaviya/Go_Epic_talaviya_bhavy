const rateLimit = require("express-rate-limit");

// General API requests
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Login protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

// Registration protection
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

// Search protection
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    message: "Too many search requests. Please try again later.",
  },
});

// Admin protection
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many admin requests. Please try again later.",
  },
});

// Create problem protection
const createProblemLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many problem submissions. Please try again later.",
  },
});

// Delete protection
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many delete requests. Please try again later.",
  },
});

// Bulk upload protection
const bulkUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many bulk uploads. Please try again later.",
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  searchLimiter,
  adminLimiter,
  createProblemLimiter,
  deleteLimiter,
  bulkUploadLimiter,
};