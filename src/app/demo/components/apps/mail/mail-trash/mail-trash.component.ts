import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/demo/components/apps/mail/service/mail.service';
import { MailTableComponent } from '../mail-table/mail-table.component';

@Component({
    templateUrl: './mail-trash.component.html',
    standalone: true,
    imports: [MailTableComponent]
})
export class MailTrashComponent implements OnDestroy {

    trashMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe(data => {
            this.trashMails = data.filter(d => d.trash);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
