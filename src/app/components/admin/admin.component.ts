import { Component } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  userId: string = '';
  constructor(private userService: GenericService<any>) {}


}
