import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IQuestion } from '../interfaces/questions.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  questionSubject = new BehaviorSubject<any>(this.getData());

  editQuestion: any;

  baseUrl: string = 'http://localhost:5000';

  constructor(private http:HttpClient) { }

  getData() {
    let data = localStorage.getItem('questions');
    return data ? JSON.parse(data) : [];
  }

  listQuestions(){
    return this.http.get(`${this.baseUrl}/questions/allQuestions`);
  }


  addQuestion(question:any){
    return  this.http.post(`${this.baseUrl}/questions/addQuestion`,question);
  }

  deleteData(q_no: number) {
    return this.http.delete(`${this.baseUrl}/questions/deleteQuestion/${q_no}`);
  }

  getQuestion(q_no: any) {
    return this.http.get(`${this.baseUrl}/questions/getQuestion/${q_no}`);
  }

  editData(q_no: any) {
    this.getQuestion(q_no).subscribe((res: any) => {
          this.editQuestion = res.question;
    });
  }
  
  getEditData() {
    return this.editQuestion;
  }

}


