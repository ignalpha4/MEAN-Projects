import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { ErrorHandling } from "../utils/errorHelper";
import {Request, Response } from "express";
import Exam from "../models/examModel";
import Question from "../models/questionsModel";


const errorObj =  new ErrorHandling();

@controller('/exam')
export class examController{
   
    async loadQuestions(@request() req: any, @response() res: Response) {
        try {
            const userEmail = req.user.email; // assuming user email is available in request object

            // Get the last exam of the user
            const lastExam = await Exam.findOne({ userEmail }).sort({ date: -1 });

            let difficulty = 1; // default difficulty level

            console.log(lastExam);

            if (lastExam) {
                if (lastExam.score >= 7) {
                    // difficulty = lastDifficulty + 1;
                } else {
                    // difficulty = lastDifficulty - 1;
                }
            }

            // Ensure difficulty is within bounds (1 to 10)
            difficulty = Math.max(1, Math.min(10, difficulty));

            // Fetch 10 questions based on the calculated difficulty
            const questions = await Question.aggregate([
                { $match: { difficulty: difficulty } },
                { $sample: { size: 10 } }
            ]);

            if (!questions || questions.length === 0) {
                throw new Error('No questions found for the given difficulty');
            }

            return res.status(200).json({ status: true, questions });

        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpPost('/submitTest')
    async submitTest(@request() req: Request, @response() res: Response) {
        try {
            const { userEmail, userName, answers } = req.body;

            let score = 0;
            const detailedAnswers = await Promise.all(answers.map(async (answer: any) => {
                const question = await Question.findById(answer.questionId);
                const isCorrect = question?.correctOption === answer.answer;
                if (isCorrect) {
                    score++;
                }
                return {
                    questionId: answer.questionId,
                    answer: answer.answer,
                    isCorrect: isCorrect,
                    correctOption: question?.correctOption,
                    difficulty: question?.difficulty
                };
            }));

            const exam = new Exam({
                userEmail,
                userName,
                date: new Date(),
                score,
                answers: detailedAnswers
            });

            await exam.save();

            return res.status(200).json({ status: true, message: "Exam submitted successfully", score });

        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }
    
}