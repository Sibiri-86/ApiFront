import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/demo/api/user';
import { ChatService } from '../service/chat.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { NgFor } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat-sidebar',
    templateUrl: './chat-sidebar.component.html',
    standalone: true,
    imports: [FormsModule, InputTextModule, NgFor, UserCardComponent]
})
export class ChatSidebarComponent implements OnInit {

    searchValue: string = '';

    users: User[] = [];

    filteredUsers: User[] = [];

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {
        this.chatService.getChatData().then(data => {
            this.users = data;
            this.filteredUsers = this.users;
        });
    }

    filter() {
        let filtered: User[] = [];
        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];
            if (user.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
                filtered.push(user)
            }
        }

        this.filteredUsers = [...filtered];
    }

}
