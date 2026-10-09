import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../Services/service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})

export class Cart implements OnInit {

  service = inject(Service);
  cdr = inject(ChangeDetectorRef)

  cart: any[] = [];

  ngOnInit() {
    this.loadCart();
  }


  loadCart() {

    const userId = localStorage.getItem("id");

    if(!userId) {
      alert("Please login first");
      return;
    }

    this.service.getCart(userId).subscribe({

        next: (response: any) => {
          console.log("CART DATA:", response.message);
          this.cart = response.message;
          this.cdr.detectChanges();
        },


        error: (response: any) => {
          console.log(response);
          alert(response.error.message);
        }
      });
  }


  removeItem(productId: any) {

    const userId = localStorage.getItem("id");

    this.service.removeFromCart(userId,productId)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          this.loadCart();
          this.service.cartUpdated.next();
        },

        error: (response: any) => {
          alert(response.error.message);
        }
      });
  }


  getTotal() {
    return this.cart.reduce((total, item) => {
        return total + ( item.productId.price * item.quantity );
      }, 0
    );
  }
}