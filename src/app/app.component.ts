import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';

interface SearchSuggestion {
  id: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
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

  constructor() {}

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