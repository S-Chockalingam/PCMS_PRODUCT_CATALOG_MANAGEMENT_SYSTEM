import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { inject } from '@angular/core';
import { Service } from '../Services/service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-products',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, CommonModule],
  templateUrl: './add-products.html',
  styleUrl: './add-products.scss',
})
export class AddProducts implements OnInit{

  formg !: FormGroup;

  service = inject(Service);
  fb = inject(FormBuilder);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  closedialog = inject(MatDialogRef);
  readDialogData = inject(MAT_DIALOG_DATA);

  isEdit : boolean = false;

  selectedImage: File | null = null;

  ngOnInit(): void {

    this.formg = this.fb.group({
      productname : ["", [Validators.required]],
      description : ["", [Validators.required]],
      category : ["", [Validators.required]],
      subcategory : ["", [Validators.required]], 
      price : ["", [Validators.required]],
      stockquantity : ["", [Validators.required]],
      brand : ["", [Validators.required]],
      availability : ["",[Validators.required]]
    })

    if(this.service.editableSingleProduct){
      this.isEdit = true;
      this.formg.patchValue(this.service.editableSingleProduct);
    }

    // if(this.readDialogData){
    //   this.formg.patchValue(this.readDialogData);
    // }
  }

  selectImage(event: any) {
    this.selectedImage = event.target.files[0];
    console.log(this.selectedImage);
  }

  addProducts() {

    const formData = new FormData();

    formData.append("productname", this.formg.value.productname);
    formData.append("description", this.formg.value.description);
    formData.append("category",this.formg.value.category);
    formData.append("subcategory", this.formg.value.subcategory);
    formData.append("price", this.formg.value.price);
    formData.append( "stockquantity", this.formg.value.stockquantity);
    formData.append( "brand", this.formg.value.brand);
    formData.append( "availability", this.formg.value.availability);


    if(this.selectedImage) {
      formData.append("image",  this.selectedImage);
    }

    this.service.addProduct(formData).subscribe({
      next : (response) => {
        alert(response.message);
        this.router.navigate(['/viewproduct']);
        this.formg.reset();
        this.closedialog.close(true);
      },

      error : (response) => {
        alert(response.error.message);
      }
  });

}

  updateProducts() {
    
    const formData = new FormData();
  
    formData.append("productname", this.formg.value.productname);
    formData.append("description",this.formg.value.description);
    formData.append("category",this.formg.value.category);
    formData.append("subcategory",this.formg.value.subcategory);
    formData.append("price",this.formg.value.price);
    formData.append("stockquantity",this.formg.value.stockquantity);
    formData.append("brand",this.formg.value.brand);
    formData.append("availability",this.formg.value.availability);

    if(this.selectedImage) {
      formData.append("image",this.selectedImage);
    }

    this.service.updateProduct(this.service.editableSingleProduct._id,formData).subscribe({
      next : (response : any) => {
        alert(response.message);
        this.router.navigate(['/viewproduct']);
        this.service.editableSingleProduct = null;
        this.closedialog.close(true);
      },

      error : (response : any) => {
        alert(response.error.message);
      }

    });
  }
}
