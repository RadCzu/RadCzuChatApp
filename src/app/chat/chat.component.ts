import { CommonModule, Time } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Links from '../../Links';
import { FormsModule } from '@angular/forms';

// komnponent służy jako test imporotwania danych z innych komponentów
// zobaczyłen też jak działa SimpleChanges
// gdybym dłużej pracował nad tym projektem i go rozbudowywał dodał bym jeszcze szyfrowanie do wiadomości i limity żeby się nie scrollowało 10 lat przy długiej konwersacji od poczatku tylko np 30 ostatnich wiadomości.

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @Input() chatId: number | null = null;
  @Input() partnerId: number | null = null;
  @Input() partnerUsername: string | null = null;
  userId: number | null = null;
  messageContent: string = "";
  messages: {
    content: string,
    recieved: boolean,
    dateTime: Date;
  }[] = [];

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.loadChat();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] || changes['partnerId']) {
      this.loadChat();
    }
  }

  loadChat(): void {
    this.messages = [];
    this.userId = Number.parseInt(this.route.snapshot.params['id'].toString());
    console.log(this.userId);
    this.fetchChatMessages();
  }

  async fetchChatMessages(): Promise<void> {
    if (!this.userId) {
      console.error('Id użytkownika nie zostało ustawione.');
      return;
    }

    if (!this.partnerId) {
      console.error('Id partnera nie zostało ustawione.');
      return;
    }

    const sql = `
    SELECT Content, Time, Date, Chat_Id, User_Id
    FROM message
    WHERE Chat_Id = ${this.chatId}
    ORDER BY Date, Time
    `;

    const url = `${Links.getURL}?sql=${encodeURIComponent(sql)}`;
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    const data: {Content: string, Time: string, Date: string, Chat_Id: number, User_Id: number}[] = await response.json();

    data.map(dataPiece => {
      const dateTimeString: string = `${dataPiece.Date}T${dataPiece.Time}`;
      const dateTime: Date = new Date(dateTimeString);
      if(this.userId === null) {
        console.error('Id użytkownika nie zostało ustawione.');
        return;
      }

      const recieved: boolean = (dataPiece.User_Id !== this.userId);
      console.log(`message author: ${dataPiece.User_Id}, us: ${this.userId}, recieved: ${recieved}`)
      const message: {
        content: string,
        recieved: boolean,
        dateTime: Date,
      } = {
        content: dataPiece.Content,
        recieved: recieved,
        dateTime: dateTime,
      }

      this.messages.push(message);
    })
  }

  async sendMessage(content: string): Promise<void> {
    if (!content) {
      console.error("Nieprawidłowa wiadomość");
      return;
    }
  
    const currentTime = new Date().toISOString();

    const messageData = {
      Content: content,
      Time: currentTime.substring(11, 19), 
      Date: currentTime.substring(0, 10),
      Chat_Id: this.chatId,
      User_Id: this.userId,
    };
  
    const url = Links.postURL;
    const sql = `INSERT INTO message (Content, Time, Date, Chat_Id, User_Id) 
    VALUES ('${messageData.Content}',
    '${messageData.Time}',
    '${messageData.Date}',
    '${messageData.Chat_Id}',
    '${messageData.User_Id}'
    );`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ sql }),
      });
  
      if (response.ok) {
        console.log('Wiadomość została pomyślnie wysłana.');
      } else {
        console.error('Wystąpił problem podczas wysyłania wiadomości.');
      }
    } catch (error) {
      console.error('Wystąpił błąd:', error);
    }

    this.messages.push({content: content, recieved: false, dateTime: new Date()});
    this.messageContent = "";
  }
}
