import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgFor, NgClass } from '@angular/common';

@Component({
    templateUrl: './productoverview.component.html',
    standalone: true,
    imports: [
        NgFor,
        NgClass,
        InputNumberModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        TabViewModule,
    ],
})
export class ProductOverviewComponent implements OnInit {
    
    color: string = 'bluegray';

    size: string = 'M';

    liked: boolean = false;

    images: string[] = [];

    selectedImageIndex: number = 0;

    quantity: number = 1;
          
    ngOnInit(): void {
      this.images = [
          'product-overview-3-1.png',
          'product-overview-3-2.png',
          'product-overview-3-3.png',
          'product-overview-3-4.png'
      ];
    }
}
