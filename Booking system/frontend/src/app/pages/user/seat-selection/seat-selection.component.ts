import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {

  seats: any[] = [];
  busId: any;
  gender: any;
  date: string = '';
  from!: string;
  to!: string;
  selectedSeatId: string | null = null;
  selectedSeatNumber!: number;
  leftSeats: any[] = [];
  rightSeats: any[] = [];
  availableSeats: number[] = [];
  totalSeats: number = 0;
  allSeats: number[] = [];

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.busId = params['busId'];
      this.from = params['from'];
      this.to = params['to'];
      this.date = params['date'];

      this.authService.getcurrentuser().subscribe((res: any) => {
        this.gender = res.user.gender;
        console.log(this.gender);
        this.getBusDetails(this.busId, this.date);
      });
    });
  }

  getBusDetails(busId: any, date: any) {
    this.userService.getBusById(busId).subscribe(
      (response: any) => {
        if (response.success) {
          this.totalSeats = response.bus.seatingCapacity;
          this.allSeats = Array.from({ length: this.totalSeats }, (_, i) => i + 1);
          this.getAvailableSeats(busId, date);
        } else {
          console.error('Failed to load bus details');
        }
      },
      (error) => {
        console.error('Error fetching bus details', error);
      }
    );
  }

  getAvailableSeats(busId: any, date: any) {
    this.adminService.getAvailableSeats(busId, date, this.from, this.to,this.gender).subscribe(
      (response: any) => {
        if (response.success) {
          this.availableSeats = response.availableSeats;
          console.log(this.availableSeats);
          this.updateSeats();
        } else {
          console.error('Failed to load available seats');
        }
      },
      (error) => {
        console.error('Error fetching available seats', error);
      }
    );
  }

  updateSeats() {
    this.seats = this.allSeats.map(seatNumber => ({
      seatNumber,
      isAvailable: this.availableSeats.includes(seatNumber),
      adjacentSeats: this.getAdjacentSeats(seatNumber)
    }));
    this.arrangeSeats();
  }

  getAdjacentSeats(seatNumber: number): number[] {
    const adjacentSeats: number[] = [];
    const column = (seatNumber - 1) % 2;

    if (column === 0) {
      adjacentSeats.push(seatNumber + 1);
    } else {
      adjacentSeats.push(seatNumber - 1);
    }

    return adjacentSeats;
  }

  arrangeSeats() {
    const totalSeats = this.seats.length;
    const seatsPerColumn = 5;

    const pairs = [];
    for (let i = 0; i < totalSeats; i += 2) {
      pairs.push(this.seats.slice(i, i + 2));
    }

    const middleIndex = Math.ceil(pairs.length / 2);
    this.leftSeats = pairs.slice(0, middleIndex);
    this.rightSeats = pairs.slice(middleIndex);

    while (this.leftSeats.length < seatsPerColumn) {
      this.leftSeats.push([]);
    }
    while (this.rightSeats.length < seatsPerColumn) {
      this.rightSeats.push([]);
    }
  }

  selectSeat(seat: any) {
    if (seat.isAvailable) {
      this.selectedSeatId = seat.seatNumber;
      this.selectedSeatNumber = seat.seatNumber;
    }
  }
  
  
  confirmSelection() {
    if (this.selectedSeatId) {
      this.router.navigate(['pages/user/dashboard/booking'], {
        queryParams: { seatNumber: this.selectedSeatNumber, busId: this.busId, from: this.from, to: this.to, date: this.date }
      });
    } else {
      alert('Please select a seat before confirming.');
    }
  }
}
