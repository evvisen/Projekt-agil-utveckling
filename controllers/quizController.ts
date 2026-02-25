import { getDB } from '../config/mongodb.js'
import type { Request, Response } from "express";

interface Quiz {
    namn: string,
    nivå: number,
    frågor: string[],
    svarsalternativ1: string[],
    svarsalternativ2: string[],
    svarsalternativ3: string[],
}

export const getEkonomiquiz = async (req: Request, res: Response) => {
    try {
        const getDatabase = getDB();
        const quizInfo = await getDatabase.collection<Quiz>("ekonomiquiz").find().toArray();
        return res.status(200).json(quizInfo);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            });
        }

    }
};

export const getJuridikquiz = async (req: Request, res: Response) => {
    try {
        const getDatabase = getDB();
        const quizInfo = await getDatabase.collection<Quiz>("juridikquiz").find().toArray();
        return res.status(200).json(quizInfo);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: error.message
            });
        }

    }
};
