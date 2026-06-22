import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "d:/Coding/StudyFlow-AI/backend/.env" });

const run = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");
    
    // Define a simple schema or query collections directly
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const users = await mongoose.connection.db.collection("users").find({}).toArray();
    console.log("Users count:", users.length);
    console.log("Users:", users.map(u => ({ id: u._id, name: u.name, email: u.email })));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

run();
