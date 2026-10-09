import { Routes } from '@angular/router';
import { Login } from './Accounts/login/login';
import { AddProducts } from './add-products/add-products';
import { ViewProducts } from './view-products/view-products';
import { Signup } from './Accounts/signup/signup';
import { Cart } from './cart/cart';
import { PurchaseHistory } from './purchase-history/purchase-history';

export const routes: Routes = [
    {path : '', component: Signup},
    {path : 'login' , component: Login},
    {path : 'addproduct', component: AddProducts},
    {path : 'viewproduct', component: ViewProducts },
    {path: 'cart',component: Cart},
    {path: 'purchase-history',component: PurchaseHistory}
]
