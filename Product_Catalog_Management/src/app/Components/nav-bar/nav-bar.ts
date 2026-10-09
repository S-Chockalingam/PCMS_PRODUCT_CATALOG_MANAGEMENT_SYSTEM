import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Service } from '../../Services/service';
import { ChangeDetectorRef } from '@angular/core';

@Component({

  selector: 'app-nav-bar',

  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    RouterLink,
  ],

  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar implements OnInit {


    token = localStorage.getItem("token");
    cartCount = 0;

    constructor(
        private router: Router,
        private service: Service,
        private cdr:ChangeDetectorRef
    ) {}


    ngOnInit() {

        this.service.loginUpdated.subscribe(() => {
            this.token = localStorage.getItem("token");
        });
        this.getCartCount();
        this.service.cartUpdated.subscribe(() => {
            this.getCartCount();
        });

    }


    getCartCount() {

        const userId = localStorage.getItem("id");

        if (!userId) {
            this.cartCount = 0;
            this.cdr.detectChanges();
            return;

        }

        this.service.getCartCount(userId).subscribe({
            next: (response: any) => {
                console.log("CART COUNT:",response.count);
                this.cartCount = response.count;
                this.cdr.detectChanges();
            },

            error: (response: any) => {
                console.log(response);
                this.cartCount = 0;
                this.cdr.detectChanges();
            }
        });
    }     

    logout() {
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        this.router.navigate(['/login']);
        this.token = null;
        this.cartCount = 0;
        this.cdr.detectChanges();
    }

}