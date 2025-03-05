import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { CurrencyService } from './service/currency.service';

interface SearchSuggestion {
  id: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'saico';

  isScrolled = false;
  isShopOpen = false;
  isSearchOpen = false;
  cartItemCount = 0; // Example value, should be updated dynamically
  searchQuery = '';
  isClothingOpen = false;

  isLoggedIn = false;
  isDropdownOpen = false;
  isAdmin = false; // Default: Not an admin
  selectedCurrency: string = 'DKK';
  currencies = [
    { code: 'EUR', symbol: '€' },
    { code: 'DKK', symbol: 'kr' },
    { code: 'USD', symbol: '$' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'PHP', symbol: '₱' },
    { code: 'CHF', symbol: 'CHF' },
  ];

  constructor(
    private currencyService: CurrencyService
  ) {}

  onCurrencyChange(event: Event) {
    const currency = (event.target as HTMLSelectElement).value;
    this.currencyService.setCurrency(currency);
  }

  ngOnInit() {
    this.checkLoginStatus();
  }
  
  checkLoginStatus() {
    const userData = localStorage.getItem('user'); // Get user from local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn && userData) {
      const user = JSON.parse(userData);
      this.isLoggedIn = true;
      this.isAdmin = user.role === 'admin'; // Check if user is an admin
    }  else {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  }
  

  logout() {
    alert("Logged Out.")
    localStorage.removeItem('user'); // Remove user data
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('isLoggedIn');

    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isDropdownOpen = false;
  }

  /** Detect scrolling to apply styles */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  /** Opens the Shop dropdown */
  onMouseEnter(): void {
    this.isShopOpen = true;
  }

  /** Closes the Shop dropdown */
  onMouseLeave(): void {
    this.isShopOpen = false;
  }

  /** Toggles search overlay */
  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when search is open
    } else {
      document.body.style.overflow = '';
    }
  }
  // Handle dropdown close when clicking a category link
  closeDropdown(event: Event) {
    event.stopPropagation();
    this.isShopOpen = false;
    this.isClothingOpen = false;
  }
  /** Toggles the cart dropdown (if applicable) */
  toggleCart(): void {
    console.log('Cart toggled'); // You can add your cart logic here
  }

  /** Handles search input changes */
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
  }
}