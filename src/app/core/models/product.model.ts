export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  promotionPrice?: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  price: number;
  promotionPrice?: number;
  imageUrl: string;
  category: string;
}

export interface ProductUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  promotionPrice?: number;
  imageUrl?: string;
  category?: string;
}