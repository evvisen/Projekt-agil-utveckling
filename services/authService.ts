import {connectDB} from "../config/sql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(){
  const db = await connectDB();

  const [rows] = await db.execute("SELECT * FROM Users");

  return rows;
};
