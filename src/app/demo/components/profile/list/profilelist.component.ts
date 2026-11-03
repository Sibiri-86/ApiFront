import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { DatePipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'primeng/api';

@Component({
    templateUrl: './profilelist.component.html',
    standalone: true,
    imports: [TableModule, SharedModule, InputTextModule, ButtonModule, ProgressBarModule, DatePipe]
})
export class ProfileListComponent implements OnInit {

    customers: Customer[] = [];

    constructor(private customerService: CustomerService, private router: Router) { }

    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    navigateToCreateUser(){
        this.router.navigate(['profile/create'])
    }

}