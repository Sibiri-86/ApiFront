import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    templateUrl: './aboutus.component.html',
    standalone: true,
    imports: [NgIf]
})
export class AboutUsComponent {

    visibleMember: number = -1;
    
}
