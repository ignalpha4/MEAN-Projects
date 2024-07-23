import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-listbuses',
  templateUrl: './listbuses.component.html',
  styleUrls: ['./listbuses.component.scss'],
})
export class ListbusesComponent implements OnInit {
  buses: any[] = [];
  filteredBuses: any[] = [];
  stops: string[] = [];
  searchForm: FormGroup;
  from!: string;
  to!: string;
  searchPerformed = false;


  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private authService:AuthService
  ) {
    this.searchForm = this.fb.group({
      from: [''],
      to: [''],
      date: [''],
    });
  }

  ngOnInit(): void {


    this.userService.getBuses().subscribe(
      (data: any) => {
        this.buses = data.buses;
        this.extractUniqueStops();
      },
      (error) => {
        console.error('Error fetching buses', error);
      }
    );
  }

  extractUniqueStops(): void {
    const stopsSet = new Set<string>();
    this.buses.forEach((bus) => {
      bus.stops.forEach((stop: any) => {
        stopsSet.add(stop.station);
      });
    });
    this.stops = Array.from(stopsSet);
  }

  onSearch() {
    const { from, to, date } = this.searchForm.value;
    this.from = from;
    this.to = to;
    this.searchPerformed = true;

    this.userService.getFilteredBuses(from, to, date).subscribe(
      (data: any) => {
        this.filteredBuses = data.buses;
      },
      (error) => {
        console.error('Error fetching filtered buses', error);
      }
    );
  }

  bookBus(busId: string) {
    this.router.navigate(['pages/user/dashboard/select-seat'], {
      queryParams: { busId, from: this.from, to: this.to },
    });
  }
}
