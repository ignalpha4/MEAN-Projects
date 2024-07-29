import { Component } from '@angular/core';
import { AdminService } from 'src/app/core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-info',
  templateUrl: './games-info.component.html',
  styleUrls: ['./games-info.component.scss']
})
export class GamesInfoComponent {
  games: any[] = [];

  constructor(private adminService: AdminService, private router: Router) {
    this.adminService.getAllGamesDetails().subscribe((res: any) => {
      this.games = res.games;
    });
  }

  viewGameDetails(gameId: string) {

    this.router.navigate(['pages/admin/dashboard/view-game'],{queryParams: {gameId:gameId },});
  }
}
