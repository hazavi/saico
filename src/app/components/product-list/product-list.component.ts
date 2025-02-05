import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../service/generic.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productList: Product[] = []; // Store the fetched products
  isLoading: boolean = true;

  constructor(
    private productService: GenericService<Product>,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all products from the backend
    this.productService.getAll('products').subscribe({
      next: (data) => {
        this.isLoading = true;
        this.productList = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        alert('Failed to load products.');
      }
    });
  }

  // Navigate to the product details page
  viewProduct(id: string, productName: string): void {
    const formattedName = productName.replace(/\s+/g, '-').toLowerCase(); // Format name for URL
    this.router.navigate(['/shop/products', id, productName]);
  }
}