import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../service/generic.service';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { Color } from '../../models/color';
import { Size } from '../../models/size';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  selectedFiles: File[] = [];
  productForm: FormGroup;
  categoryList: Category[] = [];
  colorList: Color[] = [];
  sizeList: Size[] = [];
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private productService: GenericService<Product>,
    private categoryService: GenericService<Category>,
    private colorService: GenericService<Color>,
    private sizeService: GenericService<Size>,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      colorIds: [[]],
      sizeIds: [[]],
      isFavorite: [false],
      isAvailable: [true],
      quantity: [1, [Validators.required, Validators.min(1)]],
      stocks: [1, [Validators.required, Validators.min(1)]],
      categoryIds: [[]],
    });

  }

  ngOnInit(): void {
    this.fetchCategories(); 
    this.fetchColors();
    this.fetchSizes();
  }

  fetchCategories(): void {
    this.categoryService.getAll('categories').subscribe({
      next: (data) => {
        this.categoryList = data; 
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        alert('Failed to load categories.');
      },
    });
  }
  fetchColors(): void {
    this.colorService.getAll('Colors').subscribe({
      next: (data) => {
        this.colorList = data;
      },
      error: (err) => {
        console.error('Error fetching colors:', err);
        alert('Failed to load colors.');
      }
    });
  }

  fetchSizes(): void {
    this.sizeService.getAll('Size').subscribe({
      next: (data) => {
        this.sizeList = data;
      },
      error: (err) => {
        console.error('Error fetching sizes:', err);
        alert('Failed to load sizes.');
      }
    });
  }
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.selectedFiles.length === 0) {
      if (this.productForm.invalid) {
        alert('Form is invalid. Please fill all required fields.');
      } else {
        alert('Please select at least one image file.');
      }
      return;
    }
  
    const formData = new FormData();
    formData.append('productName', this.productForm.value.productName);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price.toString());
    formData.append('colorIds', JSON.stringify(this.productForm.value.colorIds)); 
    formData.append('sizeIds', JSON.stringify(this.productForm.value.sizeIds)); 
    formData.append('isFavorite', this.productForm.value.isFavorite.toString());
    formData.append('isAvailable', this.productForm.value.isAvailable.toString());
    formData.append('quantity', this.productForm.value.quantity.toString());
    formData.append('stocks', this.productForm.value.stocks.toString());
    formData.append('categoryIds', JSON.stringify(this.productForm.value.categoryIds));
  
    // Add all selected images to the form data
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('ImageFiles', this.selectedFiles[i], this.selectedFiles[i].name);
    }
  
    // Use GenericService.create to send the form data to the backend
    this.productService.create('Products', formData as any).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.router.navigate(['/home']); // Navigate to the product list
      },
      error: (err) => {
        console.error('Error creating product:', err);
        alert('Failed to create product.');
      },
    });
  }
}
