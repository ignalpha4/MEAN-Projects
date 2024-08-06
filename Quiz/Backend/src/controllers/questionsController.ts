import { controller, httpDelete, httpGet, httpPatch, httpPost } from "inversify-express-utils";
import { verifyToken } from "../middlewares/authenticate";
import { ErrorHandling } from "../utils/errorHelper";
import { Request, Response } from 'express';
import { questionsService } from "../services/questionsService";
import { inject } from "inversify";
import { TYPES } from "../Types/user.types";

const errorObj = new ErrorHandling();

@controller('/questions')
export class questionsController {
  constructor(@inject<questionsService>(TYPES.questionsService) private questionsService: questionsService) {}

  // add question
  @httpPost("/addQuestion", verifyToken)
  async addQuestion(req: Request, res: Response) {
    try {
      const questionData = req.body;

      const addedQuestion = await this.questionsService.addQuestion(questionData);
      
      return res.json({ status: true, message: "Question added successfully", question: addedQuestion });
      
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }

  // get all questions
  @httpGet('/allQuestions', verifyToken)
  async allQuestions(req: Request, res: Response) {
    try {
      const questions = await this.questionsService.getAllQuestions();
      return res.json({ status: true, message: 'Found questions', questions });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }

  // update question
  @httpPatch('/updateQuestion/:id', verifyToken)
  async updateQuestion(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const questionData = req.body;
      const updatedQuestion = await this.questionsService.updateQuestion(id, questionData);
      return res.json({ status: true, message: 'Updated successfully', question: updatedQuestion });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }

  // delete question
  @httpDelete('/deleteQuestion/:q_no', verifyToken)
  async deleteQuestion(req: Request, res: Response) {
    try {
      const q_no = req.params.q_no;
      const deletedQuestion = await this.questionsService.deleteQuestion(q_no);
      return res.json({ status: true, message: 'Question deleted', question: deletedQuestion });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }

  // get question using quuestion no
  @httpGet('/getQuestion/:q_no', verifyToken)
  async getQuestion(req: Request, res: Response) {
    try {
      const q_no = req.params.q_no;
      const foundQuestion = await this.questionsService.getQuestion(q_no);
      return res.json({ status: true, message: 'Found question', question: foundQuestion });
    } catch (error: any) {
      const errormsg = errorObj.getErrorMsg(error) || error.message;
      return res.json({ status: false, message: errormsg });
    }
  }
}
