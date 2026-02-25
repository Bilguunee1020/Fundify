import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// ✅ Debug log (Vercel дээр харагдана)
console.log("🚀 MONGODB_URI EXISTS:", !!MONGODB_URI);
console.log("🚀 MONGO URI LENGTH:", MONGODB_URI?.length);
console.log(
  "🚀 MONGO URI START:",
  MONGODB_URI ? MONGODB_URI.substring(0, 20) : "NO_URI"
);

/**
 * Global cache to prevent multiple DB connections
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;