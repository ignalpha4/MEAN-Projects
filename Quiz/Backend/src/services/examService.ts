import { injectable } from "inversify";
import Exam from "../models/examModel";
import Question from "../models/questionsModel";
import mongoose from "mongoose";

@injectable()
export class ExamService {

    async getLastExam(userEmail: string) {
        return await Exam.findOne({ userEmail }).sort({ date: -1 });
    }

    async getQuestionsByDifficulty(difficulty: number, size: number = 10) {
        return await Question.aggregate([
            { $match: { difficulty } },
            { $sample: { size } }
        ]);
    }

    async saveExam(examData: any) {
        const exam = new Exam(examData);
        return await exam.save();
    }

    async getUserExams(userEmail: string) {
        return await Exam.find({ userEmail }).sort({ date: -1 });
    }

    async getAllExams() {
        return await Exam.find({}).sort({ date: -1 });
    }

    async getExamById(id: string) {
        return await Exam.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $lookup: { from: "questions", localField: "answers.questionId", foreignField: "_id", as: "questionDetails" } },
            { $unwind: "$answers" },
            { $lookup: { from: "questions", localField: "answers.questionId", foreignField: "_id", as: "answers.question" } },
            { $unwind: "$answers.question" },
            { $project: {
                _id: 1, date: 1, difficulty: 1, score: 1, userEmail: 1, userName: 1,
                answers: {
                    answer: "$answers.answer", isCorrect: "$answers.isCorrect", difficulty: "$answers.difficulty",
                    correctOption: "$answers.correctOption", q_no: "$answers.question.q_no", o1: "$answers.question.o1",
                    o2: "$answers.question.o2", o3: "$answers.question.o3", o4: "$answers.question.o4",
                    questionText: "$answers.question.questionText"
                }
            } },
            { $group: {
                _id: { _id: "$_id", date: "$date", difficulty: "$difficulty", score: "$score", userEmail: "$userEmail", userName: "$userName" },
                answers: { $push: "$answers" }
            } },
            { $project: {
                _id: "$_id._id", date: "$_id.date", difficulty: "$_id.difficulty", score: "$_id.score",
                userEmail: "$_id.userEmail", userName: "$_id.userName", answers: 1
            } }
        ]);
    }
}
