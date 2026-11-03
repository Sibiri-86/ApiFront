import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/demo/api/blog';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-blog-comments',
    templateUrl: './blog-comments.component.html',
    standalone: true,
    imports: [NgFor]
})
export class BlogCommentsComponent {

    @Input() comments: Comment[] = [];

    rowCount = 3;

}
