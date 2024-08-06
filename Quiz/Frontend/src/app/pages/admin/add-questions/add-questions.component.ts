import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent {
  questionForm!: FormGroup;
  errorMsg: string = '';
  question: any;

  constructor(private fb: FormBuilder, private questionsService: QuestionsService) {
    this.initForm();
    this.questionForm.reset();
    this.question = this.questionsService.getEditData();
    this.questionForm.patchValue(this.question);
  }

  initForm() {
    this.questionForm = this.fb.group({
      q_no: ['', Validators.required],
      questionText: ['', Validators.required],
      o1: ['', Validators.required],
      o2: ['', Validators.required],
      o3: ['', Validators.required],
      o4: ['', Validators.required],
      correctOption: ['', Validators.required],
      difficulty: ['', Validators.required]
    });
  }
  submit() {
    const question = this.questionForm.value;
    console.log('Submitting form:', question);

    this.questionsService.addQuestion(question).subscribe((res:any)=>{
      if(res.status){
        this.questionForm.reset();
        alert("question added!")
        this.question = null;
      }else{
        console.log(res.message);
        
        this.errorMsg = res.message;
      }

    })
  }

}
