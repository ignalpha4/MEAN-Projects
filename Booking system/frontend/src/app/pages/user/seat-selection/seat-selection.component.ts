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
  date: string = '';
  from!: string;
  to!: string;
  selectedSeatId: string | null = null;
  selectedSeatNumber!: number;
  leftSeats: any[] = [];
  gender!: string;
  rightSeats: any[] = [];

  constructor(private adminService: AdminService, private router: Router, private route: ActivatedRoute, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.busId = params['busId'];
      this.from = params['from'];
      this.to = params['to'];

      console.log("bus id :", this.busId);

      this.authService.getcurrentuser().subscribe((res: any) => {
        this.gender = res.user.gender;

        this.userService.getBusById(this.busId).subscribe((res: any) => {
          if (res.bus.date) {
            const busDate = new Date(res.bus.date);
            const formattedDate = busDate.toISOString().split('T')[0];
            this.date = formattedDate;

            this.getAvailableSeats(this.busId, this.date);
          }
        });

      })
    });
  }

  getAvailableSeats(busId: any, date: any) {
    this.adminService.getAvailableSeats(busId, date).subscribe(
      (response: any) => {
        console.log(response);
        if (response.success) {
          console.log(response.seats);
          this.seats = response.seats;
          this.arrangeSeats();
        } else {
          console.error('Failed to load available seats');
        }
      },
      (error) => {
        console.error('Error fetching available seats', error);
      }
    );
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

    console.log(this.leftSeats, this.rightSeats);

    while (this.leftSeats.length < seatsPerColumn) {
      this.leftSeats.push([]);
    }
    while (this.rightSeats.length < seatsPerColumn) {
      this.rightSeats.push([]);
    }
  }

  selectSeat(seat: any) {
    if (!seat.isBooked && !this.isSeatDisabled(seat)) {
      this.selectedSeatId = seat._id;
      this.selectedSeatNumber = seat.seatNumber;
    }
  }

  isSeatDisabled(seat: any): boolean {
    const seatNumber = seat.seatNumber;
    const isAdjacentFemaleSeatBooked = this.seats.some((s: any) => {
      return (s.isFemale && s.isBooked && (
        (seatNumber % 2 === 1 && s.seatNumber === seatNumber + 1) ||
        (seatNumber % 2 === 0 && s.seatNumber === seatNumber - 1)
      ));
    });

    return isAdjacentFemaleSeatBooked && this.gender === 'male';
  }

  confirmSelection() {
    if (this.selectedSeatId) {
      this.router.navigate(['pages/user/dashboard/booking'], { queryParams: { seatId: this.selectedSeatId, seatNumber: this.selectedSeatNumber, busId: this.busId, from: this.from, to: this.to } });
    } else {
      alert('Please select a seat before confirming.');
    }
  }
}
