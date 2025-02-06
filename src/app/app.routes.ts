import { Routes } from '@angular/router';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ProductComponent } from './components/product/product.component';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default redirect to home
    { path: 'home', component: HomeComponent }, // Home Page
    { path: 'login', component: LoginComponent }, // Login Page
    { path: 'register', component: RegisterComponent }, // Register Page


    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] }, // Admin Page
    { path: 'create-product', component: CreateProductComponent, canActivate: [adminGuard] }, // Create Product


    {
        path: 'shop',
        children: [
            { path: 'all', component: ProductListComponent }, //  All Product Pages
            { path: 'products/:id/:productName', component: ProductComponent }, //  Product Pages

        //   { path: 'create', component: CreateUserComponent }, // Create user
        //   { path: 'view/:id', component: ViewUserComponent }, // View user
        //   { path: 'update/:id', component: UpdateUserComponent }, // Update user
        ],
      },
];

