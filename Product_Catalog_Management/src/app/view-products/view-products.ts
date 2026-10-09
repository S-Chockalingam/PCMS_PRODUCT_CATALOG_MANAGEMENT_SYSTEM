import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatDialogModule,MatDialog} from '@angular/material/dialog';
import { Service } from '../Services/service';
import { AddProducts } from '../add-products/add-products';
import { BuyComponent } from '../buy-component/buy-component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-view-products',
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    AddProducts,
    BuyComponent
  ],
  templateUrl: './view-products.html',
  styleUrl: './view-products.scss'

})
export class ViewProducts implements OnInit {


  products: any[] = [];

  choosedData: any[] = [];

  choose = "all";

  role = localStorage.getItem("role");

  service = inject(Service);
  matdialog = inject(MatDialog);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.fetchProducts();
  }


  fetchProducts() {

    this.service.fetchProducts().subscribe({

        next: (response) => {
          
          this.products = response.message;
          this.choosedData = [...this.products];
          this.cdr.detectChanges();

        },

        error: (response) => {
          alert(response.error.message);
        }
      });
  }


  filter() {

    if (this.choose === "all") {

      this.choosedData = [ ...this.products ];
      this.cdr.detectChanges();
      return;
    }

    this.choosedData =
      this.products.filter(
        product => product.category === this.choose
      );
  }


  asc() {

    this.choosedData.sort(
      (a, b) => a.price - b.price
    );

  }


  desc() {

    this.choosedData.sort(
      (a, b) => b.price - a.price
    );

  }


  openDialog() {

    const dialog = this.matdialog.open(AddProducts,{
          width: '800px',
          height: '800px'
        });

    dialog.afterClosed().subscribe((value) => {

        if (value) {
          this.fetchProducts();
        }

      });

  }


  editProduct(product: any) {

    this.service.editableSingleProduct = product;

    const dialog = this.matdialog.open(AddProducts,{
          width: '800px',
          height: '800px',
          data: product
        }
      );


    dialog.afterClosed().subscribe((value) => {

        if (value) {
          this.fetchProducts();
        }
      });
    }


  deleteProduct(id: any) {

    this.service.deleteProduct(id).subscribe({

        next: (response) => {
          alert(response.message);
          this.fetchProducts();
        },

        error: (response) => {
          alert(response.error.message);
        }
      });
  }


  openBuyComponent(product: any) {

    const dialog =
      this.matdialog.open(BuyComponent,{
          data: product,
          width: '500px',
          height: '600px'
        }
      );


    dialog.afterClosed().subscribe((value) => {

        if (value) {
          this.fetchProducts();
        }
      });
  }



  addToCart(product: any) {
    
    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("Please login first");
      return;
    }


    this.service.addToCart(userId, product._id).subscribe({

        next: (response: any) => {
          alert(response.message);
          this.service.cartUpdated.next();
        },

        error: (response: any) => {
          alert(response.error.message);
        }
      });
    }
}