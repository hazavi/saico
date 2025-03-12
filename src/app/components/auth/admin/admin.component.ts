import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../../service/generic.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../service/currency.service';
import { Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product = new Product(); // Initialize as an empty Product
  isEditMode: boolean = false;
  selectedCurrency$: Observable<string>;

  filteredProducts: Product[] = [];
  currentPage = 1;
  pageSize = 10;
  sortColumn: keyof Product = 'productName'; // Default sort column
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sort order
  searchTerm = '';

  constructor(
    private productService: GenericService<Product>,
    private currencyService: CurrencyService
    
  ) {
    this.selectedCurrency$ = this.currencyService.selectedCurrency$.pipe(startWith('EUR'));
  }

  getConvertedPrice(price: number, currency: string): number {
    return this.currencyService.convertPrice(price, currency);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load all products
  loadProducts(): void {
    this.productService.getAll('products').subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Create or Update a product
  saveProduct(): void {
    if (this.isEditMode) {
      this.updateProduct(this.selectedProduct.productId);
    } else {
      this.createProduct();
    }
  }

  // Create a new product
  createProduct(): void {
    this.productService.create('products', this.selectedProduct).subscribe(
      () => {
        this.loadProducts();
        this.clearForm();
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }

  // Update an existing product
  updateProduct(productId: string): void {
    this.productService.updatebyid('products', +productId, this.selectedProduct).subscribe(
      () => {
        this.loadProducts();
        this.clearForm();
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

  // Delete a product
  deleteProduct(productId: string): void {
    this.productService.deletebyid('products', +productId).subscribe(
      () => {
        this.loadProducts();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  // Edit a product
  editProduct(product: Product): void {
    this.selectedProduct = { ...product }; // Copy the product object
    this.isEditMode = true;
  }

  // Clear the form
  clearForm(): void {
    this.selectedProduct = new Product(); // Reset to a new empty Product
    this.isEditMode = false;
  }

  // Apply filters and sorting
  applyFiltersAndSort(): void {
    let filtered = this.products;

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProducts = filtered;
  }

  // Change sort column and order
  onSort(column: keyof Product): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
  }

  // Handle search input
  onSearch(): void {
    this.applyFiltersAndSort();
  }

  // Pagination: Get current page products
  getPaginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  // Pagination: Change page
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // Pagination: Total pages
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }
  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of the middle section
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if at the beginning
      if (this.currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if at the end
      if (this.currentPage >= this.totalPages - 2) {
        startPage = this.totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // Use -1 to represent ellipsis, handle in template
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < this.totalPages - 1) {
        pages.push(-2); // Use -2 for second ellipsis
      }
      
      // Always include last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }
}
