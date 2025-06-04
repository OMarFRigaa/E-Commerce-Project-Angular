import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <h1>Manage Orders</h1>
      
      <div class="filter-section">
        <div class="filter-item">
          <label for="statusFilter">Filter by Status:</label>
          <select 
            id="statusFilter" 
            [(ngModel)]="statusFilter" 
            (change)="filterOrders()" 
            class="form-control"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <!-- Success and Error Messages -->
      @if (successMessage) {
        <div class="alert alert-success">{{ successMessage }}</div>
      }
      
      @if (errorMessage) {
        <div class="alert alert-danger">{{ errorMessage }}</div>
      }
      
      <!-- Orders Table -->
      <div class="orders-table-container">
        @if (loading) {
          <div class="loading">Loading orders...</div>
        } @else if (filteredOrders.length === 0) {
          <div class="no-orders">
            <p>No orders found matching the selected filter.</p>
          </div>
        } @else {
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders; track order.id) {
                <tr>
                  <td>#{{ order.id }}</td>
                  <td>{{ order.userId }}</td>
                  <td>{{ order.createdAt | date:'short' }}</td>
                  <td class="products-cell">
                    @for (item of order.items; track item.productId) {
                      <div class="product-item">
                        {{ item.productTitle }} (x{{ item.quantity }})
                      </div>
                    }
                  </td>
                  <td>{{ order.totalPrice.toFixed(2) }}</td>
                  <td>
                    <span class="status-badge" [ngClass]="'status-' + order.status">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    @if (order.status === 'pending') {
                      <div class="action-buttons">
                        <button 
                          class="btn btn-sm btn-success" 
                          (click)="updateOrderStatus(order.id, 'accepted')"
                          [disabled]="isProcessing && processingOrderId === order.id"
                        >
                          Accept
                        </button>
                        <button 
                          class="btn btn-sm btn-danger" 
                          (click)="updateOrderStatus(order.id, 'rejected')"
                          [disabled]="isProcessing && processingOrderId === order.id"
                        >
                          Reject
                        </button>
                      </div>
                    } @else {
                      <span class="no-actions">No actions available</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    
    .filter-section {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .filter-item label {
      font-weight: 500;
      color: #555;
    }
    
    .filter-item select {
      width: auto;
    }
    
    .orders-table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      overflow-x: auto;
    }
    
    .loading, .no-orders {
      text-align: center;
      padding: 2rem 0;
      color: #666;
    }
    
    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .orders-table th {
      text-align: left;
      padding: 1rem;
      border-bottom: 2px solid #eee;
      color: #333;
      font-weight: 600;
    }
    
    .orders-table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }
    
    .products-cell {
      max-width: 200px;
    }
    
    .product-item {
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
    
    .product-item:last-child {
      margin-bottom: 0;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      text-transform: capitalize;
    }
    
    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .status-accepted {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status-rejected {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }
    
    .no-actions {
      color: #999;
      font-size: 0.9rem;
      font-style: italic;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .orders-table th:nth-child(2),
      .orders-table td:nth-child(2),
      .orders-table th:nth-child(3),
      .orders-table td:nth-child(3) {
        display: none;
      }
    }
    
    @media (max-width: 480px) {
      .action-buttons {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  isProcessing = false;
  successMessage = '';
  errorMessage = '';
  statusFilter = 'all';
  processingOrderId: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders', error);
        this.loading = false;
        this.errorMessage = 'Failed to load orders. Please try again.';
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  filterOrders(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    }
    
    // Sort by date (newest first)
    this.filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.isProcessing = true;
    this.processingOrderId = orderId;
    this.successMessage = '';
    this.errorMessage = '';
    
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updatedOrder) => {
        this.isProcessing = false;
        this.processingOrderId = null;
        this.successMessage = `Order #${orderId} ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`;
        
        // Update order in the list
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        
        // Apply filters again
        this.filterOrders();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isProcessing = false;
        this.processingOrderId = null;
        this.errorMessage = error.message || 'Failed to update order status. Please try again.';
      }
    });
  }
}