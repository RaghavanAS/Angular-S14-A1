import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Customer } from '../models/customer';
import { CustomerService } from '../Services/Customer-Service';
import { SearchPipe } from '../pipes/SearchByPipe';
import { AppError } from '../error-handle/app-error';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [SearchPipe]
})
export class CustomerListComponent implements OnInit {

  @Input() customers: Customer[];
  @Input() cus: Customer;
  private searchData: string;
  constructor(private customerService: CustomerService, private router: Router) { }
// get customer list on init
  ngOnInit() {
    this.customerService.getCustomerList().subscribe(
      (customers: Customer[]) => {
        this.customers = customers;
      },
      (error: AppError) => {
        console.log('error:', error);
      }
    );
  }
  // navigate to customer form on add button click
  onAdd() {
    this.router.navigate(['/customers', 'new', 'edit']);
  }
}
