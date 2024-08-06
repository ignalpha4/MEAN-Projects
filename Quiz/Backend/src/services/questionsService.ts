import { injectable } from "inversify";
import questionModel from "../models/questionsModel";

@injectable()
export class questionsService {

  async addQuestion(questionData: any) {
    const { q_no, questionText, o1, o2, o3, o4, correctOption, difficulty } = questionData;

    if (!q_no || !questionText || !o1 || !o2 || !o3 || !o4 || !correctOption || !difficulty) {
      throw new Error('Required fields are not provided');
    }

    const addQuestion = await questionModel.create(questionData);

    if (!addQuestion) {
      throw new Error('Error while adding question!');
    }

    return addQuestion;
  }

  async getAllQuestions() {

    const foundQuestions = await questionModel.find();

    if (!foundQuestions) {
      throw new Error('No questions found');
    }

    return foundQuestions;
    
  }

  async updateQuestion(id: string, questionData: any) {
    const updatedQuestion = await questionModel.findByIdAndUpdate(id, questionData);

    if (!updatedQuestion) {
      throw new Error('Error while updating the question');
    }

    return updatedQuestion;
  }

  async deleteQuestion(q_no: string) {
    const deletedQuestion = await questionModel.findOne({ q_no }).deleteOne();

    if (!deletedQuestion) {
      throw new Error('Error while deleting the question');
    }

    return deletedQuestion;
  }

  async getQuestion(q_no: string) {
    const foundQuestion = await questionModel.findOne({ q_no });

    if (!foundQuestion) {
      throw new Error('No question found');
    }

    return foundQuestion;
  }
}
