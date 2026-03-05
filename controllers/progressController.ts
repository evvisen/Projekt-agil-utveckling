import { error } from "console";
import { connectDB } from "../config/sql.js";
import type { Request, Response } from "express";

export async function completeAndUnlockNext (req: Request, res: Response) {

  const {user_id, module_level_id} = req.body;

  const db = await connectDB();

  try {
    await db.beginTransaction();

    //markera nuvarande nivå som completed
    await db.execute(
      `UPDATE user_module_progress SET status= 'completed', completed_at= NOW()
WHERE user_id =? AND module_level_id=?;`,
         [user_id, module_level_id]
    );

    //hämta vilken modul och level_number denna nivån tillhör
    const [currentLevel]: any = await db.execute(
      `SELECT module_id, level_number FROM module_levels WHERE module_level_id
      = ?`,
           [module_level_id]
    );

    if (currentLevel.length === 0){
      throw new Error("Level hittades inte");
    }

    const {module_id, level_number} = currentLevel[0];

    //hitta nästa nivå i samma modul
    const [nextLevel]: any = await db.execute(
      `SELECT module_level_id FROM module_levels
         WHERE module_id = ? AND level_number = ?`,
        [module_id, level_number + 1]

    );

    //om nästa nivå finns, lås upp
    if (nextLevel.length > 0) {
      await db.execute(
        `UPDATE user_module_progress SET status = 'unlocked'
         WHERE user_id = ? AND module_level_id = ?`,
        [user_id, nextLevel[0].module_level_id]
      );
    }

    await db.commit();

    return res.status(200).json({
      success: true,
      message: "Nivå klar och nästa upplåst"
    });
  } catch (err: any) {
    await db.rollback();
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "något gick fel"
    });
  }
}

export async function getUserProgress (req: Request, res: Response) {

  const userId = req.params.user_id;
  const moduleId= req.params.module_id;

  try {
    const db= await connectDB();

    const [rows]: any = await db.execute(
      `SELECT m.name AS module, ml.level_number, ml.module_level_id, ump.status
      FROM user_module_progress ump
      INNER JOIN module_levels ml ON ump.module_level_id = ml.module_level_id INNER JOIN modules m ON ml.module_id = m.module_id
      WHERE ump.user_id = ? AND ml.module_id = ?
      ORDER BY ml.level_number ASC`,
      [userId, moduleId]
    );

    return res.status(200).json({ success: true, levels: rows });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Något gick fel" });
  }

}
