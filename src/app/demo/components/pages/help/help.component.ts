import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    templateUrl: './help.component.html',
    standalone: true,
    imports: [InputTextModule],
})
export class HelpComponent { }