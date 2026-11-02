// Illustrative Express security middleware configuration.
// npm install express helmet cors
const helmet = require("helmet");
const cors = require("cors");

const allowedOrigins = new Set([
  "https://www.example.com",
  "https://app.example.com"
]);

const securityHeaders = helmet({
  // Start with report-only CSP in a real deployment, inspect violations,
  // then enforce a policy tailored to required scripts/assets.
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  }
});

const corsPolicy = cors({
  origin(origin, callback) {
    // No Origin is common for server-to-server and same-origin requests.
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 600
});

module.exports = { securityHeaders, corsPolicy };
