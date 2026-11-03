import { Component } from '@angular/core';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppConfigComponent } from '../../../../layout/config/app.config.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: './verification.component.html',
    standalone: true,
    imports: [
        InputNumberModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        AppConfigComponent,
    ],
})
export class VerificationComponent {
    val1!: number;

    val2!: number;

    val3!: number;

    val4!: number;

    constructor(private layoutService: LayoutService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    focusOnNext(inputEl: InputNumber) {
        inputEl.input.nativeElement.focus();
    }
}
