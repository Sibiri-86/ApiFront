import { Component } from '@angular/core';
import { Comment } from 'src/app/demo/api/blog';
import { NewCommentComponent } from './new-comment/new-comment.component';
import { BlogCommentsComponent } from './blog-comments/blog-comments.component';
import { RouterLink } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    templateUrl: './blog-detail.component.html',
    standalone: true,
    imports: [ButtonModule, RippleModule, RouterLink, BlogCommentsComponent, NewCommentComponent]
})
export class BlogDetailComponent {

    comments: Comment[] = [
        {
            image: "assets/demo/images/avatar/circle/avatar-f-3@2x.png",
            name: "Courtney Henry",
            date: "03 February 2022",
            description: "Reprehenderit ut voluptas sapiente ratione nostrum est."
        },
        {
            image: "assets/demo/images/avatar/circle/avatar-f-1@2x.png",
            name: "Esther Howard",
            date: "03 February 2022",
            description: "How likely are you to recommend our company to your friends and family ?"
        },
        {
            image: "assets/demo/images/avatar/circle/avatar-f-4@2x.png",
            name: "Darlene Robertson",
            date: "03 February 2022",
            description: "Quo quia sit nihil nemo doloremque et."
        },
        {
            image: "assets/demo/images/avatar/circle/avatar-f-5@2x.png",
            name: "Esther Howard",
            date: "03 February 2022",
            description: "How likely are you to recommend our company to your friends and family ?"
        }
    ];

}
