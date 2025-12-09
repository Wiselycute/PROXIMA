import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_DB;

  if (!MONGO_URI) {
    console.error("❌ MONGO_DB environment variable is missing");
    throw new Error("MONGO_DB environment variable is missing");
  }

  if (isConnected) {
    console.log("✅ MongoDB Already Connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "taskmanager",
    });

    isConnected = true;
    console.log("✅ MongoDB Connected");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    isConnected = false;
    throw error;
  }
};
