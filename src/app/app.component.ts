import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { CurrencyService } from './service/currency.service';
import { GenericService } from './service/generic.service';
import { Category } from './models/category';
import { Product } from './models/product';

interface SearchSuggestion {
  id: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'saico';

  isScrolled = false;
  isShopOpen = false;
  isSearchOpen = false;
  searchResults: Product[] = [];
  cartItemCount = 0; // Example value, should be updated dynamically
  searchQuery = '';
  isClothingOpen = false;
  isLoading = false;

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

  categoryList: Category[] = []; // Declare and initialize categoryList

  constructor(
    private currencyService: CurrencyService,
    private categoryService: GenericService<Category>,
    private productService: GenericService<Product>
  ) {}

  onCurrencyChange(event: Event) {
    const currency = (event.target as HTMLSelectElement).value;
    this.currencyService.setCurrency(currency);
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.loadCategories();

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

  loadCategories(): void {
    this.categoryService.getAll('Categories').subscribe({
      next: (categories) => {
        this.categoryList = categories; // Populate categoryList
        console.log('Fetched Categories:', this.categoryList);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        alert('Failed to load categories.');
      },
    });
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
      this.searchQuery = ''; // Clear search query
      this.searchResults = []; // Clear search results
    }
  }

  /** Handles search input changes */
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.trim();

    if (this.searchQuery.length > 2) {
      this.isLoading = true;
      this.productService.search('products/search', this.searchQuery).subscribe(
        (products: Product[]) => {
          this.searchResults = products;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.searchResults = []; // Clear results if query is too short
    }
  }

  /** Clears the search query and results */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
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

}