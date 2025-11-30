import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB;

if (!MONGO_URI) {
  throw new Error(" MONGO_DB environment variable is missing ");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "taskmanager", // must match the name you added in the URI
    });

    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};
