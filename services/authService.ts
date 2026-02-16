import { connectDB } from "../config/sql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";

const SALT_ROUNDS = 10;
const JWT_KEY = "secretkey";


// interface

interface IUser extends RowDataPacket {
  user_id: number;
  username: string;
  password_hash: string;
  created_at: Date;
  current_level: number;
};


export async function registerUser(
  username: string,
  password: string
){

  try {
  const db = await connectDB();

  //kollar om användaren redan finns i databasen
  const [existing] = await db.execute<IUser[]>(

    "SELECT * FROM Users WHERE username = ?",

    [username]

  );
  if (existing.length > 0){
    return {sucess: false, message: "Användarnamnet är redan taget"};
  }

  //hasha lösenord
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  //spara nya användaren i databasen
  const [result] = await db.execute(
`
      INSERT INTO Users (username, password_hash, current_level)
      VALUES (?, ?, 1)
      `,
      [username, hashedPassword]
  );

//hämta den nya användarens ID
const userId= (result as any).insertId;

const token= jwt.sign(
  {user_id: userId, username},
  JWT_KEY,
  {expiresIn: "1h"}
);

  return {sucess: true, message: "Användare skapad!", token};

  } catch (err:any){
    console.error("fel vid registrering:", err);
    return {success: false, message: "Något gick fel vid registrering"};
  }
};
