import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true,
        enum: ['o1', 'o2', 'o3', 'o4']
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }
});


const examSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    answers: [answerSchema]
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;

