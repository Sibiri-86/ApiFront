import {Component} from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    standalone: true,
    imports: [ButtonModule, RippleModule]
})
export class AppFooterComponent {

    constructor(public layoutService: LayoutService) {}
}
