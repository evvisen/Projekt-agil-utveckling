import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import { connectDB } from "./config/sql.js";
import { database } from "./config/mongodb.js";
import { registerUser } from "./controllers/authController.js";
// Parse JSON bodies
app.use(express.json());

// för att ta emot forms
app.use(express.urlencoded({ extended: true }));

// Använder static files (i mappen public)
// app.use anropas varje gång applikationen får en Request
app.use(express.static("public"));
app.use(cors());

// //tillfällig test mot insomnia
// app.post("/test-register", async (req, res) => {
//     const { username, password } = req.body;
//     const result = await registerUser(username, password)
//     res.json(result)
// });

import authRoutes from "./routes/authRoutes.js";
app.use("/api", authRoutes);

import quizRoutes from "./routes/quizRoutes.js";
app.use("/api", quizRoutes);

import modulesRoutes from './routes/modulesRoutes.js'
app.use("/api", modulesRoutes)

import questionRoutes from './routes/questionsRoutes.js'
app.use("/api", questionRoutes)


async function startServer() {
    const db = await connectDB();
    await database();
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
startServer();
