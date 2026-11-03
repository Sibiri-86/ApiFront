import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    templateUrl: './error2.component.html',
    standalone: true,
    imports: [ButtonModule, RippleModule, RouterLink]
})
export class Error2Component {

}
