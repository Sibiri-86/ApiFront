import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    templateUrl: './ordersummary.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        NgFor,
        NgClass,
    ],
})
export class OrderSummaryComponent {

    products = [
        {
            name: 'Cotton Sweatshirt',
            size: 'Medium',
            color: 'White',
            price: '$12',
            quantity: '1',
            image: 'assets/demo/images/ecommerce/ordersummary/order-summary-1-1.png'
        },
        {
            name: 'Regular Jeans',
            size: 'Large',
            color: 'Black',
            price: '$24',
            quantity: '1',
            image: 'assets/demo/images/ecommerce/ordersummary/order-summary-1-2.png'
        }
    ];
}
