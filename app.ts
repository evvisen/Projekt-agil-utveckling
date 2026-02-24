import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import { connectDB } from "./config/sql.js";
import {connectMongoDB} from "./config/mongo.js";
import { registerUser } from "./controllers/authController.js";

// Parse JSON bodies
app.use(express.json());

// för att ta emot forms
app.use(express.urlencoded({ extended: true }));

// Använder static files (i mappen public)
// app.use anropas varje gång applikationen får en Request
app.use(express.static("public"));
app.use(cors());



import authRoutes from "./routes/authRoutes.js";
app.use("/api", authRoutes);

import modulesRoutes from './routes/modulesRoutes.js'
app.use("/api", modulesRoutes)

async function startServer() {
    const db = await connectDB();
    const mongo= await connectMongoDB();
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
startServer();
