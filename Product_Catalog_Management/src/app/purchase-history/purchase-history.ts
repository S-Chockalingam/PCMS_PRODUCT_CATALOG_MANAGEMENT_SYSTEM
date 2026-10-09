import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../Services/service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-purchase-history',
    imports: [CommonModule, MatButtonModule],
    templateUrl: './purchase-history.html',
    styleUrl: './purchase-history.scss'
})
export class PurchaseHistory implements OnInit {

    service = inject(Service);
    cdr = inject(ChangeDetectorRef)

    history: any[] = [];

    userId = localStorage.getItem("id");

    ngOnInit(): void {
        this.getHistory();
    }


    getHistory() {

        if (!this.userId) {
            return;
        }

        this.service.getPurchaseHistory(this.userId).subscribe({

                next: (response: any) => {
                    console.log(response);
                    this.history = response.message;
                    this.cdr.detectChanges();
                },

                error: (response: any) => {
                  alert(response.error.message);
                }
            });
    }


    getTotal(item: any) {
        return (item.price * item.quantity);
    }

}