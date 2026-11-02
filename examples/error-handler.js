// Centralized error handling: expose safe messages, log internal details.
function errorHandler(err, req, res, next) {
  const requestId = req.id || "unassigned";

  // Use a structured logger in production. Never log passwords or tokens.
  console.error({
    requestId,
    message: err.message,
    name: err.name
  });

  const status = Number.isInteger(err.status) ? err.status : 500;
  const safeMessage = status >= 500
    ? "An unexpected error occurred."
    : err.publicMessage || "The request could not be processed.";

  res.status(status).json({
    error: {
      code: status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
      message: safeMessage
    },
    requestId
  });
}

module.exports = { errorHandler };
