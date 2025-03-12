import { Component } from '@angular/core';
import { LoginModel } from '../../../models/loginmodel';
import { User } from '../../../models/user';
import { GenericService } from '../../../service/generic.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule,FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginModel = { email: '', password: '' };
  errorMessage: string = '';
  showPassword = false;
  isLoggedIn = false;

  constructor(
    private userService: GenericService<User>,
    private router: Router
  ){}

  ngOnInit() {
    this.checkLoginStatus();

  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.userService.login(this.loginData).subscribe({
      next: (response) => {
        // Store the token and user details in localStorage
        localStorage.setItem('authToken', response.token); // Save the access token
        localStorage.setItem('user', JSON.stringify(response.user)); // Save user details
        localStorage.setItem('isLoggedIn', 'true')

        alert('Login successful!');
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed!';
      }
    });
  }
}
