import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "db.json");

const defaultData = {
  admins: [],
  children: [],
  staff: [],
  members: [],
  donations: [],
  reports: [],
  charityWeeks: [],
  messages: [],
};

const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDB() {
  await db.read();
  db.data ||= defaultData;

  // Make sure every collection exists even for older db.json files
  for (const key of Object.keys(defaultData)) {
    if (!db.data[key]) db.data[key] = defaultData[key];
  }

  // Seed a default admin account on first run
  if (db.data.admins.length === 0) {
    const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const hashed = await bcrypt.hash(password, 10);
    db.data.admins.push({
      id: "admin-1",
      name: process.env.ADMIN_NAME || "Admin",
      email: process.env.ADMIN_EMAIL || "admin@itemeofhope.org",
      password: hashed,
      role: "superadmin",
      createdAt: new Date().toISOString(),
    });
    console.log("Seeded default admin:", process.env.ADMIN_EMAIL);
  }

  await db.write();
  return db;
}
