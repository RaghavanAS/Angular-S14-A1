import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CityService } from '../Services/City-Service';
import { Customer } from '../models/customer';
import { CustomerService } from '../Services/Customer-Service';
import { Observable } from 'rxjs/Observable';

import { AppError } from '../error-handle/app-error';
import { CityModel } from '../models/City-Model';

@Component({
  selector: 'app-customer-component',
  templateUrl: './customer-component.component.html',
  styleUrls: ['./customer-component.component.css']
})
export class CustomerComponentComponent implements OnInit {
  // @Output() customerCreated: EventEmitter<Customer> = new EventEmitter<Customer>();
  // Citylist and CustomerList array
  cityList: CityModel[] = [];
  customerList: Customer[] = [];
  // customer instance
  customer: Customer = new Customer();
  existingCustomer: Customer = new Customer();
  customerDetail: Customer;
  form: FormGroup;
  id: number;
  isNew: boolean;
  changesSaved: boolean;
  no_of_customers: number;
  // constructor dependency injection
  constructor(
    private cityService: CityService,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router) {
    this.createForm();
    this.customer = new Customer();
    this.isNew = true;
  }
  // validating the form using formbuilder
  private createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose( [Validators.required, Validators.pattern('[A-Za-z]*')])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*'),
      Validators.minLength(10), Validators.maxLength(10)])],
      email: ['', Validators.required],
      city: ['', Validators.required],
      DOB: ['', Validators.compose([Validators.required, Validators.pattern(
        '(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))'
      )])]
    });
  }
// get the customer based on his id by using API call
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== 'new') {
        this.id = +params.id;

        if (isNaN(this.id)) {return; }

        this.customerService.getCustomer(this.id).subscribe(
          (customer: Customer) => {
            this.customer = customer;
            this.isNew = false;
          },
          (error: AppError) => {
            console.log('error:', error);
          }
        );
      }
    });
   // this.cityList = this.cityService.getCityList();
   // invoke the city list api and get the city list
    this.cityService.getCityList().subscribe(
      (cityList: CityModel[]) => {
        this.cityList = cityList;
      },
      (error: AppError) => {
        console.log('error:', error);
      }
    );
    Object.assign(this.existingCustomer, this.customer);

   // invoke the customer list api
    this.customerService.getCustomerList().subscribe(
      (customerList: Customer[]) => {
        this.customerList = customerList;
      //  console.log(' customer list length' + this.customerList.length);
      this.no_of_customers = this.customerList.length;
      },
      (error: AppError) => {
        console.log('error:', error);
      }
    );
    // console.log('Hi' + this.customerList);

  }
  // on form submit calling the onSave method to add a customer using Customer Service
  onSave(Values) {
      this.customer.name = Values.name;
      this.customer.email = Values.email;
      this.customer.phone = Values.phone;
      this.customer.city = Values.city;
      this.customer.DOB = Values.DOB;
      if (this.isNew) {
        this.customer.id = this.no_of_customers + 1;
        console.log(this.customer.id);
      this.customerService.storeCustomer(this.customer).subscribe(
        (customer: Customer) => {
        console.log('customer added successfully'); },
        (error: AppError) => {
          console.log('error', error);
        });
    } else {
      this.customerService.updateCustomer(this.id, this.customer).subscribe(
        (customer: Customer) => {
        console.log('customer updated successfully'); },
      (error: AppError) => {
        console.log('error', error);
      });
    }
    // On successful add or update navigate to customers
    this.changesSaved = true;
    this.router.navigate(['/customers']);
  }
  // notify user the unsaved changes using CanDeactivate
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.customer.name !== this.existingCustomer.name ||
        this.customer.city !== this.existingCustomer.city ||
        this.customer.DOB !== this.existingCustomer.DOB ||
        this.customer.email !== this.existingCustomer.email ||
        this.customer.id !== this.existingCustomer.id ||
        this.customer.phone !== this.existingCustomer.phone ) &&
      !this.changesSaved
    ) {
      return confirm('Are you sure you don’t want to save the data ?');
    } else {
      return true;
    }
  }
}

