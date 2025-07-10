// /lib/db.ts

import mongoose from "mongoose";

const MONGODB_URL = process.env.DATABASE_URL;
if (!MONGODB_URL) {
    throw new Error("Please define the DATABASE_URL environment variable.");
}

const DBConnect = async () => {
    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected.");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default DBConnect;
