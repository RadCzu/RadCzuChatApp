import { Component } from '@angular/core';
import { Router } from '@angular/router';

//navbar jest prosty i zawiera tylko link do powrotu do logowania.

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }
  
  returnToLogin() {
    this.router.navigate(['/login']);
  }
}
