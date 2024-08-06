import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  constructor(private http:HttpClient) { }


  private baseUrl: string = 'http://localhost:5000';

  examSubject = new BehaviorSubject<any>(this.getData());

  getData() {
    let exams = localStorage.getItem('exams');
    return exams ? JSON.parse(exams) : []
  }
  
  getUserByEmail(email: string): any | null {
    let exams = this.getData();

    for (let exam of exams) {
      for (let item of exam) {
        if (item.useremail === email) {
          return item;
        }
      }
    }

    return null; 
  }


  getExamsByUser(userEmail: string): any[] {
    let exams = this.getData();

    const currentUserExams = exams.filter((exam: any) => {
      return exam.some((item: any) => item.useremail === userEmail);
    });

    console.log(currentUserExams);

    return currentUserExams;
  }




  viewExam(examId: any) {
    localStorage.setItem('examId', JSON.stringify(examId));
  }

  loadQuestions(){
    return  this.http.get(`${this.baseUrl}/exam/loadQuestions`);
  }

  submitTest(test:any){
    return this.http.post(`${this.baseUrl}/exam/submitTest`, test);
  }

  getResults(){
    return this.http.get(`${this.baseUrl}/exam/getResults`);
  }

  getAllResults(){
    return this.http.get(`${this.baseUrl}/exam/getAllResults`);
  }

  getExamById(id:string){
    return this.http.get(`${this.baseUrl}/exam/getExamById/${id}`); 
  }

}