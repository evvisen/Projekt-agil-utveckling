import { connectDB } from "../config/sql.js";
import type { RequestHandler } from "express";
import type { Request, Response } from "express";


export async function getQuestions(req: Request, res: Response) {

  try {

    const db = await connectDB();

    const [questions] = await db.execute(
      `SELECT m.name AS module, ml.level_number, quiz_questions_id, quiz_question, correct_option
FROM quiz_questions qq
INNER JOIN modules m on qq.module_id = m.module_id
INNER JOIN module_levels ml on qq.module_level_id = ml.module_level_id;`
    );

    return res.status(200).json({
      success: true,
      questions: questions
    });

  } catch (err: any) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Något gick fel"
    });

  }

};
