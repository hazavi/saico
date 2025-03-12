export class Product {
    productId: string = '';
    productName: string = '';
    images: string[] = []; // Store image data as base64 strings or URLs (adjust based on backend implementation)
    description: string = '';
    price: number = 0;
    colorIds: string[] = []; 
    sizeIds: string[] = []; 
    isFavorite: boolean = false;
    isAvailable: boolean = true;
    stocks: number = 0;
    categoryIds: string[] = []; // Array of category IDs
  
    constructor() {}

  }