import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExamsService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
  styleUrls: ['./view-stats.component.scss']
})
export class ViewStatsComponent implements OnInit {
  stats: any[] = [];

  constructor(private examService: ExamsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.examService.getResults().subscribe((res: any) => {
      const userExams = res.exams;
      console.log("from stats:", userExams);
      this.stats = this.generateStats(userExams);
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
