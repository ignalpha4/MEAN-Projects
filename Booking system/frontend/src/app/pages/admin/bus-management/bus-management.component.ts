import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-bus-management',
  templateUrl: './bus-management.component.html',
  styleUrls: ['./bus-management.component.scss']
})
export class BusManagementComponent implements OnInit {
  busForm: FormGroup;
  routes: any[] = [];
  seatingCapacities = [20, 24, 28,32,36,40];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private routeService: AdminService,
    private router: Router
  ) {
    this.busForm = this.fb.group({
      busNumber: ['', Validators.required],
      seatingCapacity: [null, Validators.required],
      date: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      amenities: ['', Validators.required],
      routeId: ['', Validators.required],
      stops: this.fb.array([]),
      fare:['',Validators.required],
      tax:['',Validators.required]
    });
  }

  ngOnInit() {
    this.loadRoutes();
  }

  get stops(): FormArray {
    return this.busForm.get('stops') as FormArray;
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(
      response => {
        if (response.success) {
          this.routes = response.routes;
          console.log(this.routes);
        } else {
          console.error('Failed to load routes');
        }
      },
      error => {
        console.error('Error loading routes', error);
      }
    );
  }

  getFormattedStations(route: any): string {
    return route.stations.map((station: any) => station.name).join(' -> ');
  }

  getTotalDistance(route: any): number {
    return route.stations.length > 0 ? route.stations[route.stations.length - 1].distance : 0;
  }

  onRouteChange() {
    const selectedRoute = this.routes.find(route => route._id === this.busForm.get('routeId')?.value);
    if (selectedRoute && selectedRoute.stations) {
      this.stops.clear();
      selectedRoute.stations.forEach((station: any) => {
        console.log(station.name);       
        this.stops.push(this.fb.group({
          station: [station.name],
          time: ['']
        }));
      });
    }
  }
  

  onSubmit() {
    if (this.busForm.invalid) {
      console.log("form is invalid")
      return;
    }

    const busData = this.busForm.value;

    console.log(this.busForm.value);
    this.adminService.addBus(busData).subscribe(
      response => {
        if (response.success) {
          alert('Bus added successfully');
          this.adminService.addSeats(response.bus._id, busData.seatingCapacity, busData.date).subscribe(
            (seatResponse:any) => {
              if (seatResponse.success) {
                alert('Seats added successfully');
              } else {
                console.error('Error adding seats', seatResponse.message);
              }
            },
            error => {
              console.error('Error adding seats', error);
            }
          );
        }
      },
      error => {
        console.error('Error adding bus', error);
      }
    );
  }
}
