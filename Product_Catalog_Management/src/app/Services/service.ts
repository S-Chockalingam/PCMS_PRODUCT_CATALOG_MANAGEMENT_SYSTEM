import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable , Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {

  editableSingleProduct : any;

  cartUpdated = new Subject<void>();

  loginUpdated = new Subject<void>();
  
  http = inject(HttpClient);

  signup(formData : any) : Observable<any> {
    return this.http.post("http://localhost:9000/api/signup", formData);
  }

  login(formData : any) : Observable<any>{
    return this.http.post("http://localhost:9000/api/login", formData);
  }

  addProduct(formData: FormData) : Observable<any>{
    return this.http.post("http://localhost:9000/api/addproducts", formData);
  }

  fetchProducts() : Observable<any>{
    return this.http.get("http://localhost:9000/api/fetchproducts");
  }

  deleteProduct(productId : any) : Observable<any>{
    return this.http.delete("http://localhost:9000/api/deleteproduct",{
      body : {
        id : productId
      }
    });
  }

  updateProduct(id : any, data : FormData) : Observable<any>{
    return this.http.put(`http://localhost:9000/api/updateproduct/${id}`, data);
  }

  purchase(purchasequantity:any, data:any, id : any){
    return this.http.post("http://localhost:9000/api/buyproduct", {
      purchasequantity : purchasequantity, data : data, id : id
    });
  }

  addToCart(userId: any, productId: any) {

    return this.http.post(
        "http://localhost:9000/api/addtocart",
        {
            userId: userId,
            productId: productId
        }
    );
}

getCart(userId: any) {

    return this.http.get(
        `http://localhost:9000/api/cart/${userId}`
    );

}

getCartCount(userId: any) {

    return this.http.get(
        `http://localhost:9000/api/cartcount/${userId}`
    );

}

removeFromCart(userId: any, productId: any) {

    return this.http.delete(
        "http://localhost:9000/api/removefromcart",
        {
            body : {
                userId: userId,
                productId: productId
            }
        }
    );

}

getPurchaseHistory(userId: any): Observable<any> {

    return this.http.get(
        `http://localhost:9000/api/purchase-history/${userId}`
    );

}

}
