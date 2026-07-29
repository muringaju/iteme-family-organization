import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Anyone can submit a donation pledge from the public Donate page
router.post("/", async (req, res) => {
  const { donorName, email, phone, amount, currency, method, note, childId } = req.body;

  if (!donorName || !amount) {
    return res.status(400).json({ message: "Donor name and amount are required." });
  }

  await db.read();
  const donation = {
    id: uuid(),
    donorName,
    email: email || "",
    phone: phone || "",
    amount: Number(amount),
    currency: currency || "RWF",
    method: method || "Mobile Money",
    note: note || "",
    childId: childId || null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.data.donations.push(donation);
  await db.write();
  res.status(201).json(donation);
});

// Admin only from here on
router.get("/", protect, async (req, res) => {
  await db.read();
  res.json(db.data.donations);
});

router.put("/:id", protect, async (req, res) => {
  await db.read();
  const idx = db.data.donations.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  db.data.donations[idx] = {
    ...db.data.donations[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  await db.write();
  res.json(db.data.donations[idx]);
});

router.delete("/:id", protect, async (req, res) => {
  await db.read();
  const before = db.data.donations.length;
  db.data.donations = db.data.donations.filter((d) => d.id !== req.params.id);
  if (db.data.donations.length === before) return res.status(404).json({ message: "Not found" });
  await db.write();
  res.json({ message: "Deleted successfully" });
});

export default router;
