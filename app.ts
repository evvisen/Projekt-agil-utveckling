import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import { connectDB } from "./config/sql.js";
import { registerUser } from "./services/authService.js";
// Parse JSON bodies
app.use(express.json());

// för att ta emot forms
app.use(express.urlencoded({ extended: true }));

// Använder static files (i mappen public)
// app.use anropas varje gång applikationen får en Request
app.use(express.static("public"));
app.use(cors());

//tillfällig test mot insomnia
app.post("/test-register", async (req,res)=>{
  const {username, password} = req.body;
  const result = await registerUser(username, password)
  res.json(result)
  });

async function startServer() {
  const db = await connectDB();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
startServer();
