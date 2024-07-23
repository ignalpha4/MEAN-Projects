import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BookingService } from 'src/app/core/services/booking.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  farePerKm!: number;
  taxPercentage!: number;
  seatId!:string;
  seatNumber!:number;
  currentUser: any;
  routes: any[] = [];
  from!:string;
  to!:string;
  routeId: any;
  busId: any;
  date!: string;
  selectedRoute: any = null;
  bookingForm: FormGroup;
  handlingCharge = 0;
  gender!:string;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      userId: [{ value: '', disabled: true }],
      busId: [{ value: '', disabled: true }, Validators.required],
      routeId: [{ value: '', disabled: true }, Validators.required],
      from: [{ value: '', disabled: true }, Validators.required],
      to: [{ value: '', disabled: true }, Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      seatId: ['', Validators.required],
      paymentType: ['cash', Validators.required],
      totalFare: [{ value: 0, disabled: true }],
      seatNumber:['',Validators.required],
      gender:['',Validators.required]
    });
  }

  ngOnInit() {

    this.authService.getcurrentuser().subscribe((res:any)=>{
      this.currentUser = res.user._id;
      this.gender = res.user.gender;


      

      this.route.queryParams.subscribe((params: any) => {
        this.busId = params['busId'];
        this.seatId = params['seatId'];
        this.seatNumber = params['seatNumber'];
      
        this.from = params['from'];
        this.to =params['to']; 
        
        if (this.busId) {
          this.loadBusDetails(this.busId);
        }
  
      });
      
    })

  }

  loadBusDetails(busId: any) {

    this.userService.getBusById(busId).subscribe(
      (res: any) => {

        const bus = res.bus;
        this.routeId = bus.route;

   
        const busDate = new Date(bus.date);
        this.date = busDate.toISOString().split('T')[0];

        this.bookingForm.patchValue({
          busId: this.busId,
          date: this.date,
          seatNumber:this.seatNumber,
          seatId:this.seatId,
          userId:this.currentUser,
          from:this.from,
          to:this.to,
          gender:this.gender
        });

        this.taxPercentage = bus.tax;
        this.farePerKm = bus.fare;

        this.loadRoutes(this.routeId);
      },
      (error) => {
        console.error('Error fetching bus details', error);
      }
    );
  }

  loadRoutes(routeId: any) {

    console.log("got routeid",routeId)
    if (routeId) {
      this.adminService.getRouteById(routeId).subscribe(
        (res: any) => {
          this.routes = [res.route];
          this.selectedRoute = res.route;
          this.bookingForm.patchValue({ routeId: this.routeId });
          this.calculateFare();
        },
        (error) => {
          console.error('Error fetching route details', error);
        }
      );
    }
  }
  getFormattedStations(route: any): string {
    return route.stations.map((station: any) => station.name).join(' -> ');
  }

  getTotalDistance(route: any): number {
    if (route.stations.length > 0) {
      return route.stations[route.stations.length - 1].distance;
    }
    return 0;
  }


  calculateFare() {
    const bookingData = this.bookingForm.getRawValue();

    if (this.selectedRoute && bookingData.from && bookingData.to) {
      
      const fromIndex = this.selectedRoute.stations.findIndex((station: any) => station.name === bookingData.from);
      const toIndex = this.selectedRoute.stations.findIndex((station: any) => station.name === bookingData.to);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        const distance = this.selectedRoute.stations[toIndex].distance - this.selectedRoute.stations[fromIndex].distance;
        const fare = distance * this.farePerKm;

        const totalFareBeforeTax = fare + (fare * this.taxPercentage) / 100;
        this.handlingCharge = (bookingData.paymentType === 'card' || bookingData.paymentType === 'upi') ? 26 : 0;

        this.bookingForm.patchValue({
          totalFare: totalFareBeforeTax + this.handlingCharge
        });

      } else {
        console.error('Invalid route or stations');
      }
    }
  }

  onSubmit() {

    const bookingData = this.bookingForm.getRawValue();
    console.log(bookingData);

    this.bookingService.bookSeat(bookingData).subscribe(
      (response: any) => {
        if (response.success) {

          this.adminService.updateSeatStatus(bookingData.seatId,bookingData.gender).subscribe(
            (response:any) => {
              if(response.success){
                alert("Booking done successfully!");
              }
              else{
                console.log(response.message)
              }
            },
            (error) => {
              console.error('Error updating seat status', error);
            }
          );
        }else{
          console.error("error addding to db",response.message)
        }

      },
      (error) => {
        console.error('Error booking seat', error);
      }
    );
  }
}
