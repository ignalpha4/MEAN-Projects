import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    q_no: {
        type: Number,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    o1: {
        type: String,
        required: true
    },
    o2: {
        type: String,
        required: true
    },
    o3: {
        type: String,
        required: true
    },
    o4: {
        type: String,
        required: true
    },
    correctOption: {
        type: String,
        required: true,
        enum: ['o1', 'o2', 'o3', 'o4']
    },
    difficulty: {
        type: Number,
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;