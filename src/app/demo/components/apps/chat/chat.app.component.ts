import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/demo/api/user';
import { ChatService } from './service/chat.service';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';

@Component({
    templateUrl: './chat.app.component.html',
    standalone: true,
    imports: [ChatSidebarComponent, ChatBoxComponent]
})
export class ChatAppComponent implements OnDestroy {

    subscription: Subscription;

    activeUser!: User;
    
    constructor(private chatService: ChatService) { 
        this.subscription = this.chatService.activeUser$.subscribe(data => this.activeUser = data);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
