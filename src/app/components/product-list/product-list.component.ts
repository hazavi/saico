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
    this.productService.getAll('Products').subscribe({
        next: (data) => {
            this.productList = data.map(product => ({
                ...product,
                images: product.images || [] // Handle null/undefined images
            }));
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Error fetching products:', err);
            alert('Failed to load products.');
        }
    });
}
  // Navigate to the product details page
  viewProduct(id: string, productName: string): void {
    const formattedName = productName.replace(/\s+/g, '-').toLowerCase(); 
    this.router.navigate(['/shop/products', id, productName]);
  }
}