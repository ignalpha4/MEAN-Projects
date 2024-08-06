import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExamsService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {
  stats: any[] = [];

  constructor(private examService: ExamsService, private authService: AuthService,private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params:any)=>{
      const email =  params['email'];
      console.log(email);

      this.examService.getAllResults().subscribe((res: any) => {
        const userExams = res.exams;

        console.log("all exams",userExams);
        

        let userExamsFiltered = userExams.filter((exam:any)=>exam.userEmail === email);

        console.log("the fileted exams",userExamsFiltered);
        
        this.stats = this.generateStats(userExamsFiltered);
      });

    });


  }

  generateStats(exams: any[]): any[] {
    const stats: any[] = [];

    const groupedExams = exams.reduce((acc, exam) => {
      const difficulty = exam.difficulty;
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(exam);
      return acc;
    }, {});

    console.log("groupedExams", groupedExams);

    for (const difficulty in groupedExams) {
      if (groupedExams.hasOwnProperty(difficulty)) {
        const examsForDifficulty = groupedExams[difficulty];

        console.log(examsForDifficulty);
        
        const totalScores = examsForDifficulty.reduce((acc: number, exam: any) => acc + exam.score, 0);
        const averageScore = totalScores / examsForDifficulty.length;

        stats.push({
          difficulty: difficulty,
          exams: examsForDifficulty,
          averageScore: averageScore.toFixed(2)
        });
      }
    }
    return stats;
  }
}



