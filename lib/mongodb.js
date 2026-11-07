import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  const cached = global._mongoose;
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
