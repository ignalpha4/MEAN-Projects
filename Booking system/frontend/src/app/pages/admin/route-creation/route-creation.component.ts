import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-route-creation',
  templateUrl: './route-creation.component.html',
  styleUrls: ['./route-creation.component.scss'],
})
export class RouteCreationComponent implements OnInit {
  routeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeForm = this.fb.group({
      uniqueIdentifier: ['', Validators.required],
      stations: this.fb.array([this.createStation()]),
    });

    this.addStation();
  }

  get stations(): FormArray {
    return this.routeForm.get('stations') as FormArray;
  }

  createStation(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addStation(): void {
    this.stations.push(this.createStation());
  }

  removeStation(index: number): void {
    if (this.stations.length > 2) {
      this.stations.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.routeForm.valid) {
      this.routeForm.value.stations = this.routeForm.value.stations.map(
        (station: any) => {
          return {
            name: station.name[0].toUpperCase() + station.name.slice(1),
            distance: station.distance,
          };
        }
      );


      this.adminService.createRoute(this.routeForm.value).subscribe(
        (response: any) => {
          alert('Route added successfully');
          this.router.navigate(['/pages/admin/dashboard/']);
        },
        (error) => {
          console.error('Error creating route', error);
        }
      );
    }
  }
}
