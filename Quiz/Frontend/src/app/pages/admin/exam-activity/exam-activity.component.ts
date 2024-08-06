import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExamsService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-users',
  templateUrl: './exam-activity.component.html',
  styleUrls: ['./exam-activity.component.scss']
})
export class ExamActivityComponent {
  exams: any = [];

  constructor(private examService: ExamsService, private router: Router) {
    this.examService.getAllResults().subscribe((res: any) => {
      this.exams= res.exams;
    })
   
  }

  colDef: any = [
    { headerName: 'username', field: 'userName', width: 200 },
    { headerName: 'user Email', field: 'userEmail', width: 250 },
    { headerName: 'score', field: 'score' },
    { headerName: 'date', field: 'date',width: 300  },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: () => {
        return `
          <button class="btn btn-sm btn-primary" data-action-type="view">View</button>
        `
      },
      onCellClicked: (params: any) => {
        if (params.event.target.dataset.actionType === 'view') {
          this.viewTest(params.data._id);
        }
      }
    }
  ];

  viewTest(test: any) {
    console.log('inside view');
    this.router.navigate(['pages/admin/dashboard/viewExam'],{queryParams:{id:test}});
  }
}
