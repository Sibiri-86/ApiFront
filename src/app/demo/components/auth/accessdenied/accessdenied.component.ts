import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    templateUrl: './accessdenied.component.html',
    standalone: true,
    imports: [RouterLink, ButtonModule, RippleModule]
})
export class AccessdeniedComponent { }