import { CartItem } from './cart.model';
import { User } from './user.model';

export type OrderStatus = 'pending' | 'accepted' | 'rejected';

export interface OrderItem {
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalPrice: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}