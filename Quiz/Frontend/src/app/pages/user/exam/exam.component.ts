import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExamsService } from 'src/app/core/services/exam.service';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})

export class ExamComponent {
  examForm!: FormGroup;
  questionsData: any[] = [];
  difficultyLevels = ['easy', 'medium', 'hard'];
  currentDifficultyIndex = 0;
  score: number = 0;

  userName: string | undefined;
  userEmail: string | undefined;

  constructor(
    private questionService: QuestionsService,
    private authService: AuthService,
    private fb: FormBuilder,
    private examService: ExamsService,
    private router: Router
  ) { }

  ngOnInit() {

    
    this.authService.getCurrentUser().subscribe((res: any) => {
      this.userName = res.user.name;
      this.userEmail = res.user.email;
   })

    this.loadQuestions();
    this.initForm();
  }

  exitTest() {
    if (window.confirm('are you sure you want to exit the test?')) {
      this.router.navigate(['pages/user/dashboard']);
    }
  }
  
  loadQuestions() {


    this.examService.loadQuestions().subscribe((res: any) => {
        this.questionsData = res.questions;
        this.initForm();
    });

  }

  initForm() {
    this.examForm = this.fb.group({
      questions: this.fb.array([])
    });
    this.addQuestions();
  }

  get questions() {
    return this.examForm.get('questions') as FormArray;
  }

  addQuestions() {
    this.questionsData.forEach((question: any) => {
      this.questions.push(this.fb.group({
        q_no: [question.q_no],
        question: [question.questionText],
        questionId:[question._id],
        o1: [question.o1],
        o2: [question.o2],
        o3: [question.o3],
        o4: [question.o4],
        correctOption: [question.correctOption],
        answer: ['', Validators.required],
        difficulty: [question.difficulty]
      }));
    });
  }
  submitTest() {
    
    let examForm = this.examForm.value;
    console.log(examForm);
    
    if (window.confirm('are you sure you want to submit the test?')) {

      let exam = {
        userName:this.userName,
        userEmail:this.userEmail,
        answers:examForm.questions
      }
  
      this.examService.submitTest(exam).subscribe((res: any) => {
        if(res.status){
          alert('Test Submitted Successfully');
          this.router.navigate(['pages/user/dashboard']);
        }
        else{
          alert('Test Submission Failed');
        }
      },
      (error:any) => {
        alert(error.message);   
      }
      )
    }
  }
}
