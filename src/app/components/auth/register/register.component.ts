import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { GenericService } from '../../../service/generic.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginModel } from '../../../models/loginmodel';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule,FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: LoginModel = { email: '', password: '' };
  successMessage: string = '';
  errorMessage: string = '';
  showPassword = false;

  constructor(
    private userService: GenericService<User>,
    private router: Router
  ) {}

  register() {
    this.userService.register(this.registerData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed!';
      }
    });
  }
}
