import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }
  await db.read();
  const entry = {
    id: uuid(),
    name,
    email,
    subject: subject || "General inquiry",
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.data.messages.push(entry);
  await db.write();
  res.status(201).json({ message: "Thank you, your message has been received." });
});

router.get("/", protect, async (req, res) => {
  await db.read();
  res.json(db.data.messages.slice().reverse());
});

router.put("/:id", protect, async (req, res) => {
  await db.read();
  const idx = db.data.messages.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  db.data.messages[idx] = { ...db.data.messages[idx], ...req.body };
  await db.write();
  res.json(db.data.messages[idx]);
});

router.delete("/:id", protect, async (req, res) => {
  await db.read();
  const before = db.data.messages.length;
  db.data.messages = db.data.messages.filter((m) => m.id !== req.params.id);
  if (db.data.messages.length === before) return res.status(404).json({ message: "Not found" });
  await db.write();
  res.json({ message: "Deleted successfully" });
});

export default router;
