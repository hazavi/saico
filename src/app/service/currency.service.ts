import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrency = new BehaviorSubject<string>('EUR');
  selectedCurrency$ = this.selectedCurrency.asObservable();

  private exchangeRates: { [key: string]: number } = {
    EUR: 1.0,
    USD: 1.0,
    DKK: 6.89,
    JPY: 150.75,
    CAD: 1.35,
    PHP: 56.00,
    CHF: 0.91,
  };

  setCurrency(currency: string) {
    this.selectedCurrency.next(currency);
  }

  convertPrice(price: number, currency: string): number {
    const rate = this.exchangeRates[currency] || 1;
    const convertedPrice = price * rate;
    return Math.ceil(convertedPrice);
  }
  
}
