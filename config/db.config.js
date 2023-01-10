import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGOURI);
    console.log(`Connected to Mongo! DB: ${db.connections[0].name}`);
  } catch (error) {
    console.error(error);
  }
};
connectDB();
