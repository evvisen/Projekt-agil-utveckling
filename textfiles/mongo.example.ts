import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:dinport/quiz";

export async function connectMongoDB(): Promise<void> {

  await mongoose.connect(MONGO_URI);

  console.log("Ansluten till MongoDB-databasen!");

}
