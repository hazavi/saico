import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { CurrencyService } from '../../service/currency.service';
import { Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  productList: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;
  categoryTitle: string = 'All Products';
  currentCategoryId: string | null = null;
  categoryMap: { [key: string]: string } = {}; // Store category ID -> Name mapping
  selectedCurrency$: Observable<string>;

  constructor(
    private productService: GenericService<Product>,
    private categoryService: GenericService<any>,
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {
    this.selectedCurrency$ = this.currencyService.selectedCurrency$.pipe(startWith('EUR')); // Default currency
  }

  getConvertedPrice(price: number, currency: string): number {
    return this.currencyService.convertPrice(price, currency);
  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    this.route.paramMap.subscribe((params) => {
      const categoryParam = params.get('category') || 'all';
      this.currentCategoryId = this.getCategoryIdByName(categoryParam.toLowerCase());
      this.updateCategoryTitle();
      this.filterProducts();
    });
  }

  /**
   * Fetches all categories and builds the category map.
   */
loadCategories(): void {
  this.categoryService.getAll('Categories').subscribe({
    next: (categories) => {
      this.categoryMap = categories.reduce((acc: { [key: string]: string }, category: any) => {
        if (category.categoryId && category.categoryName) {
          acc[category.categoryName.toLowerCase()] = category.categoryId; // Map lowercase categoryName -> categoryId
        }
        return acc;
      }, {});

      console.log('Category Map:', this.categoryMap); // Log to verify

      // Reapply filtering after categories are loaded
      const categoryParam = this.route.snapshot.paramMap.get('category') || 'all';
      this.currentCategoryId = this.getCategoryIdByName(categoryParam.toLowerCase());
      this.updateCategoryTitle();

      // Load products after categories are loaded
      this.loadProducts();
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
      alert('Failed to load categories.');
    },
  });
}

  /**
   * Fetches all products and applies filtering based on the current category.
   */
  loadProducts(): void {
    this.productService.getAll('Products').subscribe({
      next: (data) => {
        this.productList = data.map((product) => {
          let categoryIds: string[] = [];
  
          // Ensure categoryIds is an actual array
          if (typeof product.categoryIds === 'string') {
            try {
              categoryIds = JSON.parse(product.categoryIds);
              if (!Array.isArray(categoryIds)) throw new Error('Parsed value is not an array');
              // Ensure all elements are strings and trim whitespace
              categoryIds = categoryIds.map(id => String(id).trim());
            } catch (error) {
              console.error('Error parsing categoryIds:', product.categoryIds, error);
              categoryIds = [];
            }
          } else if (Array.isArray(product.categoryIds)) {
            // Ensure all elements are strings and trim whitespace
            categoryIds = product.categoryIds.map(id => String(id).trim());
          }
  
          return {
            ...product,
            categoryIds,
            images: Array.isArray(product.images) ? product.images : [],
          };
        });
  
        console.log('✅ Parsed Product List:', this.productList);
        this.isLoading = false;
  
        // Apply filtering after products are loaded
        this.filterProducts();
      },
      error: (err) => {
        console.error('❌ Error fetching products:', err);
        alert('Failed to load products.');
      },
    });
  }

  /**
   * Filters products based on the current category ID.
   */
  
  filterProducts(): void {
    console.log('Current Category ID:', this.currentCategoryId);
    console.log('Product List:', this.productList);
  
    if (!this.currentCategoryId || this.currentCategoryId === 'all') {
      this.filteredProducts = [...this.productList]; // Show all products
      console.log('Filtered Products (All):', this.filteredProducts);
    } else {
      // Filter products by matching categoryIds
      this.filteredProducts = this.productList.filter(product => {
        const includesCategory = Array.isArray(product.categoryIds) && product.categoryIds.includes(this.currentCategoryId!);
        console.log(`Product ${product.productName} has categoryIds:`, product.categoryIds, `Includes '${this.currentCategoryId}'?`, includesCategory);
        return includesCategory;
      });
      console.log('Filtered Products:', this.filteredProducts);
    }
  }
  
  /**
   * Updates the category title based on the current category ID.
   */
  updateCategoryTitle(): void {
    if (!this.currentCategoryId || this.currentCategoryId === 'all') {
      this.categoryTitle = 'All Products';
    } else {
      this.categoryTitle = this.categoryMap[this.currentCategoryId] || 'Products';
    }
  }

  getCategoryIdByName(categoryName: string): string | null {
    if (!categoryName) return null;
  
    // Handle the 'all' case explicitly
    if (categoryName === 'all') {
      console.log(`getCategoryIdByName('${categoryName}') -> 'all'`);
      return 'all';
    }
  
    const categoryId = this.categoryMap[categoryName.toLowerCase()];
    console.log(`getCategoryIdByName('${categoryName}') -> ${categoryId}`);
    return categoryId || null;
  }

  viewProduct(id: string, productName: string): void {
    const formattedName = productName.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate(['/shop/products', id, formattedName]);
  }
}