import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../service/generic.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { Color } from '../../models/color';
import { Size } from '../../models/size';
import { Category } from '../../models/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-product',
  imports: [CommonModule,CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent, BreadcrumbsComponent ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  breadcrumbItems: { label: string; url?: string }[] = [];

  product: Product | null = null;
  colorList: Color[] = [];
  sizeList: Size[] = [];
  categoryList: Category[] = [];
  isLoading: boolean = true;

  currentIndex = 0; // Track the currently displayed image index
  selectedColor: string = ''; // Selected color ID
  selectedSize: string = ''; // Selected size ID
  selectedQuantity: number = 1; // Default quantity

  expandedSection: string | null = null;
  selectedUnit: 'cm' | 'inches' = 'cm';
  
  constructor(
    private route: ActivatedRoute,
    private productService: GenericService<Product>,
    private colorService: GenericService<Color>,
    private sizeService: GenericService<Size>,
    private categoryService: GenericService<Category>,

    private router: Router,
  ) {}

  ngOnInit(): void {
    // Get the product ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      const productName = decodeURIComponent(
        this.route.snapshot.paramMap.get('productName') || ''
      );  
      if (productId && productName) {
        this.isLoading = true;

        this.fetchProduct(productId, productName);
        this.fetchCategories();
        this.fetchColors();
        this.fetchSizes();
      }
    });
    
  }
  
  fetchProduct(id: string, productName: string): void {
    this.productService.getbyid('products', id).subscribe({
      next: (data) => {
        data.colorIds = JSON.parse(data.colorIds[0]);
        data.sizeIds = JSON.parse(data.sizeIds[0]);
        data.categoryIds = JSON.parse(data.categoryIds[0]);
        this.product = data;
        this.selectedColor = this.product?.colorIds[0] || ''; 
        this.selectedSize = this.product?.sizeIds[0] || ''; 
        this.isLoading = false;      

        this.breadcrumbItems = [
          { label: 'Home', url: '/' },
          { label: 'Products', url: '/shop/all' },
          { label: this.product?.productName || 'Product' } 
        ];

      },
      error: (err) => {
        console.error('Error fetching product:', err);
        alert('Failed to load product details.');
        this.isLoading = false;
      }
    });
  }

toggleSection(section: string) {
  this.expandedSection = this.expandedSection === section ? null : section;
}

  fetchCategories(): void {
    this.categoryService.getAll('Categories').subscribe({
      next: (data) => {
        this.categoryList = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
  fetchColors(): void {
    this.colorService.getAll('Colors').subscribe({
      next: (data) => {
        this.colorList = data;
      },
      error: (err) => {
        console.error('Error fetching colors:', err);
      }
    });
  }

  fetchSizes(): void {
    this.sizeService.getAll('Sizes').subscribe({
      next: (data) => {
        this.sizeList = data;
      },
      error: (err) => {
        console.error('Error fetching sizes:', err);
      }
    });
  }

  getColorName(colorId: string): string {
    const color = this.colorList.find(c => c.colorId === colorId);
    return color?.colorName || 'N/A';
  }
  getHexCode(colorId: string): string {
    const color = this.colorList.find((c) => c.colorId === colorId);
    return color ? color.hexCode : '#FFFFFF'; // Default to white if not found
  }
  getSizeName(sizeId: string): string {
    const size = this.sizeList.find(s => s.sizeId === sizeId);
    return size?.dimensions || 'N/A';
  }
  getSortedSizes(): Size[] {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    return this.sizeList.sort((a, b) => order.indexOf(a.dimensions) - order.indexOf(b.dimensions));
  }
  
  getCategoryName(categoryId: string): string {
    const category = this.categoryList.find(c => c.categoryId === categoryId);
    return category?.categoryName || 'N/A';
  }
  get currentImage(): string {
    return this.product?.images[this.currentIndex] || '';
  }

  nextImage(): void {
    if (this.product && this.currentIndex < this.product.images.length - 1) {
      this.currentIndex++;
    }
  }

  prevImage(): void {
    if (this.product && this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  selectImage(index: number): void {
    if (this.product) {
      this.currentIndex = index;
    }
  }
    // Getter for formatted description
  get formattedDescription(): string[] {
    if (!this.product || !this.product.description) return [];

    // Split the description by dashes
    const parts = this.product.description.split('-').map(part => part.trim()).filter(Boolean);

    // Process each part: Add a dash only if it wasn't the first part
    return parts.map((part, index) => {
      if (index === 0) {
        // First part: Do not add a dash
        return part;
      } else {
        // Subsequent parts: Prepend a dash
        return `- ${part}`;
      }
    });
  }
}