import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { File } from 'src/app/demo/api/file';
import { ChipModule } from 'primeng/chip';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { NgIf, NgFor } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    templateUrl: './blog-edit.component.html',
    styleUrls: ['./blog-edit.component.scss'],
    standalone: true,
    imports: [FileUploadModule, SharedModule, NgIf, ButtonModule, RippleModule, InputTextModule, InputTextareaModule, EditorModule, NgFor, ChipModule]
})
export class BlogEditComponent {

    @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;

    image: any;

    objectURL: string = '';

    tags: string[] = ['Software', 'Web'];

    onUpload(event: any) {
        let file = event.files[0];
        file.objectURL = file.objectURL ? file.objectURL : this.objectURL;

        if (!file.objectURL) {
            return;
        }
        else {
            this.image = file;
            this.objectURL = file.objectURL;
        }
    }

    removeImage() {
        this.image = null;
    }

}

