import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  gameId!: string;
  game: any;
  currentPlayer: any;

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
        this.currentPlayer = this.game.players[this.game.currentPlayerIndex];
      } else {
        console.error('Failed to load game');
      }
    });
  }

  makeMove(row: number, col: number) {
    if (this.game.grid[row][col] !== null || this.game.gameStatus === 'completed') {
      return;
    }

    this.userService.makeMove(this.gameId, row, col).subscribe((res: any) => {
      if (res.success) {
        this.game = res.game;
        this.currentPlayer = this.game.players[this.game.currentPlayerIndex];
      } else {
        console.error('Failed to make move');
      }
    });
  }

  isCellOccupied(row: number, col: number) {
    return this.game.grid[row][col] !== null;
  }

  getCellColor(row: number, col: number) {
    return this.game.grid[row][col] || '#f0f0f0'; // Default color if cell is empty
  }
}
