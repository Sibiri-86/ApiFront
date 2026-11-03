import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-new-comment',
    templateUrl: './new-comment.component.html',
    standalone: true,
    imports: [InputTextModule, InputTextareaModule, ButtonModule, RippleModule]
})
export class NewCommentComponent { }
