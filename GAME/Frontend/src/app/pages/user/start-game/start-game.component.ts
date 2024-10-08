import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { uniqueColorsValidator } from 'src/app/core/validators/colorValidator';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss']
})
export class StartGameComponent implements OnInit {
  gameForm: FormGroup;
  colors: string[] = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'Orange' , 'Purple', 'Pink'];

  constructor(private fb: FormBuilder,private toastr:ToastrService, private userService: UserService,private router:Router) {
    this.gameForm = this.fb.group({
      size: ['', [Validators.required, Validators.min(3)]],
      players: this.fb.array([],uniqueColorsValidator)
    });
  }

  ngOnInit(): void {
    this.addPlayer(); 
    this.addPlayer(); 
  }

  get players(): FormArray {
    return this.gameForm.get('players') as FormArray;
  }

  addPlayer(): void {
    const playerGroup = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required]
    });
    this.players.push(playerGroup);
  }

  removePlayer(index: number): void {
    if (this.players.length > 1) {
      this.players.removeAt(index);
    }
  }

  submit(): void {

    console.log(this.gameForm);
    if (this.gameForm.invalid) {
      this.toastr.error('Please fix the errors in the form');
      return;
    }

    const formData = this.gameForm.value;
    
    this.userService.createGame(formData).subscribe(
      (res:any) => {
        if (res.success) {

          let game = res.game;

          console.log("this is the game component",game._id);
          
          this.toastr.success('Game created successfully');
          this.router.navigate(['/pages/user/dashboard/game-board'], { queryParams: { gameId:game._id } });
        }else{
          this.toastr.error(res.message);
          console.log(res.message);
          
        } 
      },
      (error: any) => {
        console.log(error);
        this.toastr.error(error.message);
      }
    );
  }
}
