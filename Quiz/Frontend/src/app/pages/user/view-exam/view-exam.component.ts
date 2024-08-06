import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-view-exam',
  templateUrl: './view-exam.component.html',
  styleUrls: ['./view-exam.component.scss']
})
export class ViewExamComponent {
  currentExam: any=[];
  id:any;
  constructor(private examService: ExamsService,private router: Router,private route: ActivatedRoute) {

    this.route.queryParams.subscribe((params:any)=>{
      this.id =  params['id'];

      this.examService.getExamById(this.id).subscribe((res:any)=>{
        this.currentExam = res.exam[0];
        console.log("from view exam component",this,this.currentExam);
      });

    })

  }
}

