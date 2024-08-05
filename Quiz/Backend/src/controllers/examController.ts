import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import { ErrorHandling } from "../utils/errorHelper";
import {Request, Response } from "express";
import Exam from "../models/examModel";
import Question from "../models/questionsModel";
import { verifyToken } from "../middlewares/authenticate";
import mongoose from "mongoose";


const errorObj =  new ErrorHandling();

@controller('/exam')
export class examController{


    @httpGet('/loadQuestions',verifyToken)
    async loadQuestions(@request() req: any, @response() res: Response) {
        try {
            const userEmail = req.user.email; 

            const lastExam = await Exam.findOne({ userEmail }).sort({ date: -1 });

            let difficulty = 1;
            let lastDifficulty = lastExam?.difficulty || 1;

            console.log("Last exam:",lastExam?.difficulty);

            if (lastExam) {
              if (lastDifficulty < 10 && lastDifficulty > 1) {
                if (lastExam.score >= 7) {
                  difficulty = lastDifficulty + 1;
                } else {
                  difficulty = lastDifficulty - 1;
                }
              } else if (lastDifficulty === 1) {
                if (lastExam.score >= 7) {
                  difficulty = lastDifficulty + 1;
                }
              } else if (lastDifficulty === 10) {
                difficulty = lastDifficulty;
                if (lastExam.score < 7) {
                  difficulty = lastDifficulty - 1;
                }
              }
            }

            console.log("last difficulty",lastDifficulty);
            
            console.log("updated difficulty",difficulty);
            
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

            console.log("Detailed answers:",detailedAnswers);
            
            const exam = new Exam({
                userEmail,
                userName,
                date: new Date(),
                score,
                answers: detailedAnswers,
                difficulty: detailedAnswers[0].difficulty 
            });

            await exam.save();

            return res.status(200).json({ status: true, message: "Exam submitted successfully", score });

        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            console.log(errorMsg);
            
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }
    
    @httpGet('/getResults',verifyToken)
    async getResults(@request() req: any, @response() res: Response) {
        try {
            const userEmail = req.user.email;
            const exams = await Exam.find({ userEmail }).sort({ date: -1 });
            return res.status(200).json({ status: true, exams });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpGet('/getAllResults',verifyToken)
    async getAllResults(@request() req: any, @response() res: Response) {
        try {
            const exams = await Exam.find({}).sort({ date: -1 });
            return res.status(200).json({ status: true, exams });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }
    }

    @httpGet('/getExamById/:id',verifyToken)
    async getExamById(@request() req: Request, @response() res: Response) {
        try {
            const id = req.params.id;
            // const exam = await Exam.findById(id);
            // console.log("Exam:",exam);

            let exam = await Exam.aggregate(
                [
                    {
                      $match: {
                        _id: new mongoose.Types.ObjectId(id)
                      }
                    },
                    {
                      $lookup: {
                        from: "questions",
                        localField: "answers.questionId",
                        foreignField: "_id",
                        as: "questionDetails"
                      }
                    },
                    {
                      $unwind: "$answers"
                    },
                    {
                      $lookup: {
                        from: "questions",
                        localField: "answers.questionId",
                        foreignField: "_id",
                        as: "answers.question"
                      }
                    },
                    {
                      $unwind: "$answers.question"
                    },
                    {
                      $project: {
                        _id: 1,
                        date: 1,
                        difficulty: 1,
                        score: 1,
                        userEmail: 1,
                        userName: 1,
                        answers: {
                          answer: "$answers.answer",
                          isCorrect: "$answers.isCorrect",
                          difficulty: "$answers.difficulty",
                          correctOption: "$answers.correctOption",
                          q_no: "$answers.question.q_no",
                          o1: "$answers.question.o1",
                          o2: "$answers.question.o2",
                          o3: "$answers.question.o3",
                          o4: "$answers.question.o4",
                        questionText:"$answers.question.questionText"
                        }
                      }
                    },
                    {
                      $group: {
                        _id: {
                          _id: "$_id",
                          date: "$date",
                          difficulty: "$difficulty",
                          score: "$score",
                          userEmail: "$userEmail",
                          userName: "$userName"
                        },
                        answers: { $push: "$answers" }
                      }
                    },
                    {
                      $project: {
                        _id: "$_id._id",
                        date: "$_id.date",
                        difficulty: "$_id.difficulty",
                        score: "$_id.score",
                        userEmail: "$_id.userEmail",
                        userName: "$_id.userName",
                        answers: 1
                      }
                    }
                  ]
            );


            return res.status(200).json({ status: true, exam });
        } catch (error: any) {
            const errorMsg = errorObj.getErrorMsg(error) || error.message;
            return res.status(500).json({ status: false, message: errorMsg });
        }

    }

}