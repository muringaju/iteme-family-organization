import express from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/db.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

/**
 * Builds a standard REST router (GET all, GET one, POST, PUT, DELETE)
 * for a collection stored in db.data[collectionName].
 *
 * @param {string} collectionName - key in db.data, e.g. "children"
 * @param {object} options
 * @param {boolean} options.withImage - whether create/update accept a single image upload
 * @param {boolean} options.publicRead - whether GET routes are open (no auth)
 */
export function buildCrudRouter(collectionName, options = {}) {
  const { withImage = false, publicRead = true } = options;
  const router = express.Router();
  const imageMiddleware = withImage ? upload.single("image") : (req, res, next) => next();

  const readGuard = publicRead ? (req, res, next) => next() : protect;

  router.get("/", readGuard, async (req, res) => {
    await db.read();
    res.json(db.data[collectionName]);
  });

  router.get("/:id", readGuard, async (req, res) => {
    await db.read();
    const item = db.data[collectionName].find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  router.post("/", protect, imageMiddleware, async (req, res) => {
    await db.read();
    const item = {
      id: uuid(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    if (withImage && req.file) {
      item.image = `/uploads/${req.file.filename}`;
    }
    db.data[collectionName].push(item);
    await db.write();
    res.status(201).json(item);
  });

  router.put("/:id", protect, imageMiddleware, async (req, res) => {
    await db.read();
    const idx = db.data[collectionName].findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    const updated = {
      ...db.data[collectionName][idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    if (withImage && req.file) {
      updated.image = `/uploads/${req.file.filename}`;
    }
    db.data[collectionName][idx] = updated;
    await db.write();
    res.json(updated);
  });

  router.delete("/:id", protect, async (req, res) => {
    await db.read();
    const before = db.data[collectionName].length;
    db.data[collectionName] = db.data[collectionName].filter((i) => i.id !== req.params.id);
    if (db.data[collectionName].length === before) {
      return res.status(404).json({ message: "Not found" });
    }
    await db.write();
    res.json({ message: "Deleted successfully" });
  });

  return router;
}
