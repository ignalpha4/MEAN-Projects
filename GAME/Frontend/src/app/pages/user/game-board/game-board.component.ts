import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private route: ActivatedRoute,private toastr:ToastrService, private userService: UserService) {}

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
        this.toastr.error('Failed to load game',res.message);
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
        this.toastr.error('error in making move:',res.error);
      }
    });
  }

  isCellOccupied(row: number, col: number) {
    return this.game.grid[row][col] !== null;
  }

  getCellColor(row: number, col: number) {
    return this.game.grid[row][col] || '#f0f0f0'; 
  }

  getRanks() {
    return this.game.players.sort((a: any, b: any) => b.score - a.score);
  }
  
  getRank(index: number) :any{
    const ranks = this.getRanks();
    if (index === 0) return 1;
    const previousScore = ranks[index - 1].score;
    const currentScore = ranks[index].score;
    return previousScore === currentScore ? this.getRank(index - 1) : index + 1;
  }
}
