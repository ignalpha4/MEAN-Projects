// razorpay.service.ts
import { Injectable } from '@angular/core';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  constructor() {}

  public payWithRazorpay(productPrice :any) {
    const options = {
      key: 'rzp_test_tjgbiOe0fHOcMp', 
      amount: productPrice * 100,
      currency: "INR",
      name: 'AMEEZOONE',
      description: 'Payment for your order',
      // order_id: res.id,
      handler: function (response: any) {
        alert('Payment successful: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'XYZ',
        email: 'xyz@example.com',
        contact: '9309709505',
      },
      notes: {
        address: 'Customer Address',
      },
      theme: {
        color: '#012652',
      },
    };


    const rzp1 = new Razorpay(options);
    console.log(rzp1);
    
    rzp1.open();
  }
}
