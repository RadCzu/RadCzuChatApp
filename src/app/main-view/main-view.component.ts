import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatlistComponent } from '../chatlist/chatlist.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [ChatComponent, ChatlistComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

}
