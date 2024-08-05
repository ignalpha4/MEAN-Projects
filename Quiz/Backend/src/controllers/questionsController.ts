import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut } from "inversify-express-utils";
import { verifyToken } from "../middlewares/authenticate";
import questionModel from "../models/questionsModel";
import { ErrorHandling } from "../utils/errorHelper";
import  {Request,Response } from 'express';

const errorObj = new ErrorHandling();

@controller('/questions')
export class questionsController{

    constructor(){};
    //add question
    @httpPost("/addQuestion",verifyToken)
    async addQuestion(req:Request,res:Response){
        try {

            
            const {q_no,questionText,o1,o2,o3,o4,correctOption,difficulty} = req.body;

            if(!q_no || !questionText ||!o1 || !o2 || !o3 || !o4 || !correctOption || !difficulty){
                throw new Error('Required fields are not provided')
            }

            const addQuestion =  await  questionModel.create(req.body);

            if(!addQuestion){
                throw new Error('Error while adding question!')
            }

            return res.json({ status: true, message: "question added successfull" });

        } catch (error:any) {
            const errormsg= errorObj.getErrorMsg(error) || error.message;
            return res.json({status:false,message:errormsg})
        }
        
    }
    //get questions
    @httpGet('/allQuestions',verifyToken)
    async allQuestions(req:Request,res:Response){

        try {
            const foundQuestions = await questionModel.find();

            if(!foundQuestions){
                throw new Error('No questions found');
            }

            return res.json({status:true,message:'Found questions',questions:foundQuestions});
            
        } catch (error:any) {
            const errormsg  =  errorObj.getErrorMsg(error) ||  error.message;
            return res.json({status:false,message:errormsg});
        }

    }

    @httpPatch('/updateQuestion/:id',verifyToken)
    async updateQuestion(req:Request,res:Response){
        try {
            const id =  req.params.id;

            console.log(id);
            
            const updatedQuestion =  await questionModel.findByIdAndUpdate(id,req.body);

            if(!updatedQuestion){
                throw new Error("error while updating the question");
            }

            return res.json({status:true,message:'Updated successfully',updatedQuestion});

        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            return res.json({status:false,message:errormsg});
        }
    }

    @httpDelete('/deleteQuestion/:q_no',verifyToken)
    async deleteQuestion(req:Request,res:Response){

        try {
            
            const q_no = req.params.q_no;

            const deletedQuestion  = await questionModel.findOne({q_no}).deleteOne();

            if(!deletedQuestion){
                throw new Error('Error while deleting the question');
            }

            return res.json({status:true,message:'Question deleted',deletedQuestion});


        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.msg;
            console.log(errormsg);
            
            return res.json({status:false,message:errormsg});
        }

    }

    @httpGet('/getQuestion/:q_no',verifyToken)
    async getQuestion(req:Request,res:Response){    
        try {

            const q_no = req.params.q_no;

            const foundQuestion = await questionModel.findOne({q_no});

            if(!foundQuestion){
                throw new Error('No question found');
            }

            return res.json({status:true,message:'Found question',question:foundQuestion});
            
        } catch (error:any) {
            const errormsg = errorObj.getErrorMsg(error) || error.message;
            return res.json({status:false,message:errormsg});
        }

    }
}
