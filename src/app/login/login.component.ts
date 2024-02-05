import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})

export class LoginComponent {
  constructor(private router: Router) { }
  isConfirmationVisible: boolean = false;
  isFieldEmpty: boolean = false;
  username: string = ''; 

  showConfirmation() {
    this.isFieldEmpty = false;
    if(this.username === ''){
      this.isFieldEmpty = true;
    } else {
      this.isConfirmationVisible = true;
    }
  }

  onConfirmation(response: boolean) {
    if (response) {
      console.log(`poprawne logowanie jako ${this.username}`);
      this.router.navigate(['/Account', this.username]);
    } else {
      this.isConfirmationVisible = false;
      this.username = ''; 
    }
  }
}