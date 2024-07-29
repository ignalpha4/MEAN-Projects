import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss']
})
export class ViewGameComponent implements OnInit {
  gameId!: string;
  game: any;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gameId = params['gameId'];
      if (this.gameId) {
        this.loadGame();
      }
    });
  }

  loadGame() {
    this.userService.getGame(this.gameId).subscribe((res: any) => {
      if (res.success) {
        this.game = res.game;
      } else {
        console.error('Failed to load game');
      }
    });
  }

  isCellOccupied(row: number, col: number) {
    return this.game.grid[row][col] !== null;
  }

  getCellColor(row: number, col: number) {
    return this.game.grid[row][col] || '#f0f0f0'; 
  }
}
