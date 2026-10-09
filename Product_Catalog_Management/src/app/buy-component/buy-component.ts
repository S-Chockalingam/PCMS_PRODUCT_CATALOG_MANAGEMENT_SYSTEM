import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../Services/service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-buy-component',
  imports: [FormsModule, MatButtonModule, MatRadioModule],
  templateUrl: './buy-component.html',
  styleUrl: './buy-component.scss',
})
export class BuyComponent {

  matdialogref = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  service = inject(Service);

  id = localStorage.getItem("id");

  purchasequantity ! :any;
  paymentMethod !: any;

  Check(){
    if(Number(this.data.stockquantity) >= Number(this.purchasequantity)
      && 
      Number(this.purchasequantity) > 0){
      alert("you can buy items");
      this.buyItems(this.purchasequantity, this.data);
    }
    else{
      alert("much items not available!!!");
    }
  }

  buyItems(purchasequantity :any, data : any){
    this.service.purchase(purchasequantity, data, this.id).subscribe({
      next : (response : any) => {
        console.table(response.message);
        alert(response.message);
        this.matdialogref.close(true);
      },
      error : (response) => {
        console.table(response.error.message);
      }
    })
  }

}
