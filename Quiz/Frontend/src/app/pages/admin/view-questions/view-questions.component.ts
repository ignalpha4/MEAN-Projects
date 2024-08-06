import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionsService } from 'src/app/core/services/questions.service';

@Component({
  selector: 'app-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.scss']
})
export class ViewQuestionsComponent {
  questions: any;

  constructor(private questionsService: QuestionsService, private router: Router) { }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionsService.listQuestions().subscribe((res: any) => {
      this.questions = res.questions;
    })
  }

  colDef: any = [
    { headerName: 'Q_No', field: 'q_no', width: 80 },
    { headerName: 'Question', field: 'questionText', width: 250 },
    { headerName: 'Option 1', field: 'o1', width: 150 },
    { headerName: 'Option 2', field: 'o2', width: 150 },
    { headerName: 'Option 3', field: 'o3', width: 150 },
    { headerName: 'Option 4', field: 'o4', width: 150 },
    { headerName: 'Correct Opt', field: 'correctOption', width: 100 },
    { headerName: 'Difficulty', field: 'difficulty', width: 100 },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: () => {
        return `
        <button type='button' class='btn btn-primary btn-sm' data-action-type='edit'>Edit</button>
        <button type='button' class='btn btn-danger btn-sm mx-2' data-action-type='delete'>Delete</button>
        `
      },
      onCellClicked: (params: any) => {
        if (params.event.target.dataset.actionType === 'edit') {
          this.editQuestion(params.data.q_no);
        }
        if (params.event.target.dataset.actionType === 'delete') {
          this.deleteQuestion(params.data.q_no);
        }
      },
      width: 160
    },
  ]

  editQuestion(q_no: number) {
    this.questionsService.editData(q_no);
    setTimeout(() => {
      this.router.navigate(['/pages/admin/dashboard/addQuestions'])
    }, 100);
  }

  deleteQuestion(q_no: number) {
   this.questionsService.deleteData(q_no).subscribe((res: any) => {
      if (res.status) {
        alert("Question deleted successfully");
        this.loadQuestions();
      }
    }
  )}
}


