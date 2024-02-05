import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Links from '../../Links';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})

/*
Logowanie jest bardzo proste
Sprawdziłem jak działa podmiana elementów w czasie rzeczywistym w angularze.
Po wciśnięciu zalogowania, zamiast pola do logowania jest pytanie czy <username> to użytkownik.
Po odmowie stan wraca do poprzedniego.
Po zaakceptowaniu następuje przeniesienie na dynamiczny link do profilu konta.
Jeśli takiego konta nie ma to zostaje stworzone.
Nie można sięzalogować na puste pole ''.
*/

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

  async onConfirmation(response: boolean) {
    if (response) {


      console.log(`poprawne logowanie jako ${this.username}`);
      let sql = `SELECT User_Id 
      FROM user
      WHERE Username LIKE '${this.username}'`;
      const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });

      let data: {User_Id: number}[] = await response.json();

      if(data.length === 0) {
        console.log(`tworzę nowego użytkownika: ${this.username}`);
        const postSQL = `INSERT INTO user (Username)
        VALUES ('${this.username}');
        `;
        //SELECT LAST_INSERT_ID() AS User_Id;
        const postUrl = Links.postURL;
        await fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({ sql: postSQL }),
        });

        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });

        data = await response.json();
      }

      this.router.navigate(['/account', data[0].User_Id]);
    } else {
      this.isConfirmationVisible = false;
      this.username = ''; 
    }
  }
}