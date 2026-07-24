import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Payment } from '../../../models/payment';
// import { Payment as PaymentService } from '../../../services/payment';
import { FilterPipe } from '../../../../../shared/pipes/filter-pipe';
// import { PaymentService } from '../../../services/payment';
import { PaymentApiService as PaymentService } from '../../../services/payment';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss',
})
export class PaymentHistory implements OnInit {

  // declare
  paymentIdSearch: string = '';
  billIdSearch: string = '';
  payments = signal<Payment[]>([]);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.loadPayments();
  }

  // Load All Payments
  loadPayments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.paymentService.getAllPayments().subscribe({
      next: (response: Payment[]) => {
        this.payments.set(response);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load payments');
      }
    });
  }

}