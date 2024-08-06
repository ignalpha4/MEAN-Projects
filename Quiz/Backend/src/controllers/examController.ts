import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { inject } from "inversify";
import { ErrorHandling } from "../utils/errorHelper";
import { ExamService } from "../services/";
import { verifyToken } from "../middlewares/authenticate";
import Question from "../models/questionsModel";
import { TYPES } from "../Types/";

const errorObj = new ErrorHandling();

@controller('/exam')
export class examController {

    constructor(@inject<ExamService>(TYPES.ExamService) private examService: ExamService) {}

    @httpGet('/loadQuestions', verifyToken)
    async loadQuestions(@request() req: any, @response() res: Response) {
        try {
            const userEmail = req.user.email;
            const lastExam = await this.examService.getLastExam(userEmail);

            let difficulty = 1;
            const lastDifficulty = lastExam?.difficulty || 1;

            if (lastExam) {
                if (lastDifficulty < 10 && lastDifficulty > 1) {
                    difficulty = lastExam.score >= 7 ? lastDifficulty + 1 : lastDifficulty - 1;
                } else if (lastDifficulty === 1) {
                    difficulty = lastExam.score >= 7 ? lastDifficulty + 1 : lastDifficulty;
                } else if (lastDifficulty === 10 && lastExam.score < 7) {
                    difficulty = lastDifficulty - 1;
                }
            }

            const questions = await this.examService.getQuestionsByDifficulty(difficulty);

            if (!questions.length) {
                throw new Error('No questions found for the current difficulty');
            }

            return res.status(200).json({ status: true, questions });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpPost('/submitTest', verifyToken)
    async submitTest(@request() req: Request, @response() res: Response) {
        try {
            const { userEmail, userName, answers } = req.body;

            let score = 0;

            const detailedAnswers = await Promise.all(answers.map(async (answer: any) => {
                const question = await Question.findById(answer.questionId);
                const isCorrect = question?.correctOption === answer.answer;

                if (isCorrect) score++;

                return {
                    questionId: answer.questionId,
                    answer: answer.answer,
                    isCorrect,
                    correctOption: question?.correctOption,
                    difficulty: question?.difficulty
                };
            }));

            const examData = {
                userEmail,
                userName,
                date: new Date(),
                score,
                answers: detailedAnswers,
                difficulty: detailedAnswers[0].difficulty
            };

            await this.examService.saveExam(examData);

            return res.status(200).json({ status: true, message: "Exam submitted successfully", score });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpGet('/getResults', verifyToken)
    async getResults(@request() req: any, @response() res: Response) {
        try {
            const userEmail = req.user.email;
            const exams = await this.examService.getUserExams(userEmail);
            return res.status(200).json({ status: true, exams });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpGet('/getAllResults', verifyToken)
    async getAllResults(@request() req: any, @response() res: Response) {
        try {
            const exams = await this.examService.getAllExams();
            return res.status(200).json({ status: true, exams });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpGet('/getExamById/:id', verifyToken)
    async getExamById(@request() req: Request, @response() res: Response) {
        try {
            const id = req.params.id;
            const exam = await this.examService.getExamById(id);
            return res.status(200).json({ status: true, exam });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }
}
