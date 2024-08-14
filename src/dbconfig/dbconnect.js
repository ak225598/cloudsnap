import mongoose from "mongoose";

export async function connect() {
  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // If not connected, create a new connection
    await mongoose.connect(process.env.DB_CONNECTION_URL);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
