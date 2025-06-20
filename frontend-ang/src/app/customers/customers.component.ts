import {Component, OnInit} from '@angular/core';


import {CustomerService} from '../services/customer.service';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Customer} from '../model/customer.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Router} from "@angular/router";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgForOf,

  ],
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: object ;
  searchFormGroup: FormGroup | undefined;
  constructor(private customerService: CustomerService, private fb : FormBuilder,private router: Router) {

  }

  ngOnInit() {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control("")
    });
      this.handleSearchCustomers();
  }

  handleSearchCustomers() {
      let kw = this.searchFormGroup?.value.keyword;
      this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err =>{
        this.errorMessage = err.message;
        return throwError(err);
      })
    );

  }

  handleDeleteCustomers(c: Customer) {
        let conf = confirm("Are you sure you want to delete?");
        if (!conf) return;
        this.customerService.deleteCustomer(c.id).subscribe({
          next: (resp) => {
            this.customers = this.customers.pipe(
              map(data => {
                let index = data.indexOf(c);
                data.slice(index,1);
                return data;
              })
            )
          },
          error: err => {
            console.log(err);
          }
        })
  }


  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/"+customer.id,{state :customer});

  }
}
