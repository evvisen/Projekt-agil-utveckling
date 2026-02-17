import { connectDB } from "../config/sql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const SALT_ROUNDS = 10;
const JWT_KEY = "secretkey";


// interface hur användare ser ut i databasen

interface IUser extends RowDataPacket {
    user_id: number;
    username: string;
    password_hash: string;
    created_at: Date;
    current_level: number;
};

//register user
export async function registerUser(
    req: Request, res: Response
) {

    const body = req.body as { username: string; password: string };

    const username = body.username;
    const password = body.password;

    if (!username || !password) {

        return res.status(400).json({

            success: false,
            message: "användarnamn och lösenord krävs"

        });

    }

    try {
        const db = await connectDB();

        //kollar om användaren redan finns i databasen
        const [existing] = await db.execute<IUser[]>(

            "SELECT * FROM Users WHERE username = ?",

            [username]

        );
        if (existing.length > 0) {
            return res.status(400).json({ sucess: false, message: "Användarnamnet är redan taget" });
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
        const userId = (result as any).insertId;

        const token = jwt.sign(
            { user_id: userId, username },
            JWT_KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ success: true, message: "Användare skapad!", token });

    } catch (err: any) {
        console.error("fel vid registrering:", err);
        return res.status(500).json({ success: false, message: "Något gick fel vid registrering" });
    }
};


//logga in funktion
export async function loginUser(req: Request, res: Response) {
    const body = req.body as { username: string; password: string };

    const username = body.username;
    const password = body.password;

    if (!username || !password) {

        return res.status(400).json({

            success: false,
            message: "Username och password krävs"

        });

    }
    try {
        const db = await connectDB();

        // hämta användaren från databasen
        const [users] = await db.execute<IUser[]>(
            "SELECT * FROM Users WHERE username = ?",
            [username]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Fel användarnamn eller lösenord" });
        }

        const user = users[0]!;

        // jämför lösenordet med bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Fel användarnamn eller lösenord" });
        }

        // skapa JWT-token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            JWT_KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ success: true, message: "Inloggning lyckades!", token });
    } catch (err: any) {
        console.error("Fel vid login:", err);
        return res.status(500).json({ success: false, message: "Något gick fel vid inloggning" });
    }
}
