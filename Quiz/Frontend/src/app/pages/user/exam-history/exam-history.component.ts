import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExamsService } from 'src/app/core/services/exam.service';
import { AuthService } from 'src/app/core/services/auth.service'; // Import AuthService

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss']
})
export class ExamHistoryComponent {
  exams: any[] = [];
  currentUser: any;

  constructor(
    private examService: ExamsService,
    private router: Router,
    private authService: AuthService
  ) {
    
      this.examService.getResults().subscribe((res:any)=>{
        this.exams = res.exams;
        console.log(this.exams);
        
      })
  }

  viewExam(exam: any) {
    this.router.navigate(['/pages/user/viewExam'],{queryParams:{id:exam._id}});
    this.examService.viewExam(exam._id);
  }


}
