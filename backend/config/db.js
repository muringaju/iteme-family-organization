import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";

import Admin from "../models/Admin.js";

let memoryMongoServer;

export async function initDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    memoryMongoServer = await MongoMemoryServer.create();
    console.log(
      `Using in-memory MongoDB server at ${memoryMongoServer.getUri()}`
    );
  }

  await mongoose.connect(uri || memoryMongoServer.getUri(), {
    dbName: process.env.MONGO_DB_NAME || "iteme-family-organization",
  });

  console.log("Connected to MongoDB");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@itemeofhope.org").toLowerCase();
  const adminExists = await Admin.findOne({ email: adminEmail }).lean();

  if (!adminExists) {
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log(`Seeded default admin: ${adminEmail}`);
  }
}

export async function closeDB() {
  await mongoose.disconnect();

  if (memoryMongoServer) {
    await memoryMongoServer.stop();
  }
}