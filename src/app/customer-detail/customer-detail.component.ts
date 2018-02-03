import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomerService } from '../Services/Customer-Service';
import { Customer } from '../models/customer';
import { JsonPipe } from '@angular/common';
import { ChangeChar } from '../pipes/changeToCapital';
import { AppError } from '../error-handle/app-error';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
  providers: [ ChangeChar]
})
export class CustomerDetailComponent implements OnInit {
// using input directive to get the customerDetail from parent
  customer: Customer = new Customer();
  id: number;

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
// get customer based on id
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.customerService.getCustomer(this.id).subscribe(
        (customer: Customer) => {
          this.customer = customer;
        },
        (error: AppError) => {
          console.log('error:', error);
        }
      );
    });
  }
// navigate to customer form on edit button click
  onEdit() {
    this.router.navigate(['/customers', this.id, 'edit']);
  }
}
