import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';

@Component({
    templateUrl: './landing.component.html',
    styles: [
        `
            ::placeholder {
                color: #fff;
            }
        `,
    ],
    standalone: true,
    imports: [
        RippleModule,
        StyleClassModule,
        ButtonModule,
        InputTextModule,
    ],
})
export class LandingComponent {
    constructor(private layoutService: LayoutService) {}

    scrollBehavior(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth' });
    }

    scrollToElement($element: any): void {
        setTimeout(() => {
            $element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }, 200);
    }
}
