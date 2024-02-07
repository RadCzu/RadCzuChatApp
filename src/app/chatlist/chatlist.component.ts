import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import Links from '../../Links';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// komponent służy do testowania @Output, obrazków oraz formularzy.

@Component({
  selector: 'app-chatlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})
export class ChatlistComponent {
  chatList: { chatid: number, name: string, partnerid: number, }[] = [];
  myUsername: string = "";
  userId: number = 1;
  username: string = "";

  @Output() chatSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output() partnerUsername: EventEmitter<string> = new EventEmitter<string>();
  @Output() partnerId: EventEmitter<number> = new EventEmitter<number>();

  onChatClicked(chatId: number, partnerUsername: string, partnerId: number) {
    console.log(`clicked chat: ${chatId} with ${partnerUsername}`)
    this.chatSelected.emit(chatId);
    this.partnerUsername.emit(partnerUsername);
    this.partnerId.emit(partnerId);
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.fetchUserChats();
  }

  async fetchUserChats(): Promise<void> {
    this.chatList = [];
    if (!this.userId) {
      console.error('Id użytkownika nie zostało ustawione.');
      return;
    }

    const sql = `
      SELECT IF(User1_Id = '${this.userId}', User2_Id, User1_Id) AS OtherUser_Id, Chat_Id, u.Username AS OtherUsername
      FROM chat c
      JOIN user u ON IF(User1_Id = '${this.userId}', User2_Id, User1_Id) = u.User_Id
      WHERE User1_Id = '${this.userId}' OR User2_Id = '${this.userId}'
    `;

    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    let data: {OtherUser_Id: number, Chat_Id: number, OtherUsername: string}[] = await response.json();

    data.map((dataPiece) => {
      this.chatList.push({chatid: dataPiece.Chat_Id ,name: dataPiece.OtherUsername, partnerid: dataPiece.OtherUser_Id});
    });
  }

  async createChat(username: string): Promise<void> {
    this.myUsername = await this.getUsernameByUserId(this.userId);
    console.log(`creating a new chat with ${username}`);
    console.log(`obecny użytkownik: ${this.myUsername} \npartner: ${username}`);
    if(username === '' || this.myUsername === username) {
      return;
    }
    const userExists = await this.checkIfUserExists(username);
    if (!userExists) {
      await this.createUser(username);
    }
    const otherUserId = await this.getUserIdByUsername(username);
    await this.createChatBetweenUsers(this.userId, otherUserId);
    await this.fetchUserChats();
    this.username = '';
  }

  async checkIfUserExists(username: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM user WHERE Username LIKE '${username}'`;
    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    return data[0].count > 0;
  }

  async createUser(username: string): Promise<void> {
    const sql = `INSERT INTO user (Username) VALUES ('${username}')`;
    const url = Links.postURL;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ sql }),
    });
  }

  async getUserIdByUsername(username: string): Promise<number> {
    const sql = `SELECT User_Id FROM user WHERE Username LIKE '${username}'`;
    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    return data[0].User_Id;
  }

  async getUsernameByUserId(userId: number): Promise<string> {
    const sql = `SELECT Username FROM user WHERE User_Id LIKE '${userId}'`;
    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    const data: {Username: string}[] = await response.json();
    console.log(data);
    return data[0].Username;
  }

  async createChatBetweenUsers(userId1: number, userId2: number): Promise<void> {
    const sql = `INSERT INTO chat (User1_Id, User2_Id) VALUES (${userId1}, ${userId2})`;
    const url = Links.postURL;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ sql }),
    });
  }

}
