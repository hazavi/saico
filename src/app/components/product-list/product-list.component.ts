import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productList: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;
  categoryTitle: string = 'All Products';
  currentCategoryId: string | null = null;
  categoryMap: { [key: string]: string } = {}; // Store category ID -> Name mapping

  constructor(
    private productService: GenericService<Product>,
    private categoryService: GenericService<any>, // Use correct type for categories
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  
    this.route.paramMap.subscribe(params => {
      const categoryParam = params.get('category') || 'all';
      this.currentCategoryId = this.getCategoryIdByName(categoryParam.toLowerCase()); 
      this.updateCategoryTitle();
      this.filterProducts();
    });
  }

  loadCategories(): void {
    this.categoryService.getAll('Categories').subscribe({
      next: (categories) => {
        this.categoryMap = categories.reduce((acc: { [key: string]: string }, category: any) => {
          // Store category names in lowercase for easier matching
          acc[category.id] = category.name.toLowerCase();
          return acc;
        }, {});
        console.log('Category Map:', this.categoryMap); // Check if it's populated properly
  
        // Now that categories are loaded, handle URL and filtering
        this.route.paramMap.subscribe(params => {
          const categoryParam = params.get('category') || 'all';
          this.currentCategoryId = this.getCategoryIdByName(categoryParam.toLowerCase()); // Convert categoryParam to lowercase
          this.updateCategoryTitle();
          this.filterProducts(); // Filter after categories and currentCategoryId are ready
        });
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }
  

  loadProducts(): void {
    this.productService.getAll('Products').subscribe({
      next: (data) => {
        this.productList = data.map(product => ({
          ...product,
          images: product.images || []
        }));
        this.isLoading = false;
        this.filterProducts();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        alert('Failed to load products.');
      }
    });
  }

  filterProducts(): void {
    console.log('Current Category ID:', this.currentCategoryId);
    console.log('Product List:', this.productList);
  
    if (!this.currentCategoryId || this.currentCategoryId === 'all') {
      this.filteredProducts = [...this.productList]; // Show all products
    } else if (!Object.keys(this.categoryMap).includes(this.currentCategoryId)) {
      console.warn(`Invalid category ID: ${this.currentCategoryId}`);
      this.filteredProducts = []; // No products for invalid category
    } else {
      // Filter products by matching categoryIds
      this.filteredProducts = this.productList.filter(product =>
        product.categoryIds.some(id => id === this.currentCategoryId)
      );
    }
  
    console.log('Filtered Products:', this.filteredProducts);
  }
  
  updateCategoryTitle(): void {
    if (!this.currentCategoryId || this.currentCategoryId === 'all') {
      this.categoryTitle = 'All Products';
    } else {
      this.categoryTitle = this.categoryMap[this.currentCategoryId] || 'Products';
    }
    console.log('Updated Category Title:', this.categoryTitle);
  }
  
  getCategoryIdByName(categoryName: string): string | null {
    const lowerCaseName = categoryName.toLowerCase();
    return Object.keys(this.categoryMap).find(id => this.categoryMap[id] === lowerCaseName) || null;
  }

  viewProduct(id: string, productName: string): void {
    const formattedName = productName.replace(/\s+/g, '-').toLowerCase();
    this.router.navigate(['/shop/products', id, formattedName]);
  }
}
