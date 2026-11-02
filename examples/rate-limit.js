// Illustrative public inquiry rate limit.
// npm install express-rate-limit
const { rateLimit } = require("express-rate-limit");

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again later."
    }
  }
});

// Apply only to the public inquiry route:
// app.post("/api/v1/inquiries", inquiryLimiter, handler);
//
// In multi-instance production deployments, configure a shared store
// (e.g. Redis) and set Express trust proxy correctly for the platform.
module.exports = { inquiryLimiter };
