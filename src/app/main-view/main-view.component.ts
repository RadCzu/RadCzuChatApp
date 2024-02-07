import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatlistComponent } from '../chatlist/chatlist.component';
import { CommonModule } from '@angular/common';

// komponent zawierający dwa główne komponenty czatu i listy czatów.

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [ChatComponent, ChatlistComponent, CommonModule],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {
  selectedChatId: number | null = null;
  selectedPartnerUsername: string | null = null;
  selectedPartnerId: number | null = null;

  onChatSelected(chatId: number) {
    console.log(`current chat id: ${chatId}`);
    this.selectedChatId = chatId;
  }

  onPartnerUsernameSelected(partnerUsername: string) {
    console.log(`partner username: ${partnerUsername}`);
    this.selectedPartnerUsername = partnerUsername;
  }

  onPartnerIdSelected(partnerId: number) {
    console.log(`partner id: ${partnerId}`);
    this.selectedPartnerId = partnerId;
  }
}
