import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { paymentsRouter } from "./routes/payments.js";

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:8080")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any Vercel preview/production deployment of this project
      // (each deploy gets a unique *.vercel.app subdomain).
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/payments", paymentsRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Instashop API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
