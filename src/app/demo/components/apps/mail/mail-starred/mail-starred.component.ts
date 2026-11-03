import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/demo/components/apps/mail/service/mail.service';
import { MailTableComponent } from '../mail-table/mail-table.component';

@Component({
    selector: 'app-mail-starred',
    templateUrl: './mail-starred.component.html',
    standalone: true,
    imports: [MailTableComponent],
})
export class MailStarredComponent implements OnDestroy {
    starredMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.starredMails = data.filter(
                (d) => d.starred && !d.archived && !d.trash
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
