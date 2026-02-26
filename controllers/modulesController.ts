import { connectDB } from "../config/sql.js";
import type { RequestHandler } from "express";
import type { Request, Response } from "express";

//hämta moduler
export async function getModules(req: Request, res: Response) {

  try {

    const db = await connectDB();

    const [modules] = await db.execute(
      `SELECT * FROM modules;`
    );

    return res.status(200).json({
      success: true,
      modules: modules
    });

  } catch (err: any) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Något gick fel"
    });

  }

};
