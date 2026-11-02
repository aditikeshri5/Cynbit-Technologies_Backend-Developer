// Illustrative Express route validation using Zod.
// npm install express zod
const express = require("express");
const { z } = require("zod");

const app = express();
app.use(express.json({ limit: "32kb" }));

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(3000)
}).strict();

app.post("/api/v1/inquiries", async (req, res, next) => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check the submitted fields.",
          details: parsed.error.issues.map(({ path, message }) => ({
            field: path.join("."),
            message
          }))
        }
      });
    }

    // Persist safely / enqueue email delivery here.
    // Do not trust client-supplied IDs or status fields.
    return res.status(202).json({
      data: { status: "received" }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = app;
