import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { OrderService } from "../../core/services/order.service";
import { User } from "../../core/models/user.model";
import { Order } from "../../core/models/order.model";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <h1>My Profile</h1>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="profile-card">
            <div class="profile-image">
              <img
                [src]="
                  user?.imageUrl ||
                  'https://randomuser.me/api/portraits/lego/1.jpg'
                "
                [alt]="user?.username"
              />
            </div>
            <h2>{{ user?.username }}</h2>
            <p>{{ user?.email }}</p>
          </div>

          <div class="profile-menu">
            <button
              class="menu-item"
              [class.active]="activeTab === 'info'"
              (click)="setActiveTab('info')"
            >
              Personal Information
            </button>
            <button
              class="menu-item"
              [class.active]="activeTab === 'orders'"
              (click)="setActiveTab('orders')"
            >
              My Orders
            </button>
          </div>
        </div>

        <div class="profile-main">
          <!-- Personal Information Tab -->
          @if (activeTab === 'info') {
          <div class="profile-section">
            <h2>Personal Information</h2>

            @if (updateSuccess) {
            <div class="alert alert-success">Profile updated successfully!</div>
            } @if (updateError) {
            <div class="alert alert-danger">{{ updateError }}</div>
            }

            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
              <div class="form-group">
                <label for="username">Username</label>
                <input
                  type="text"
                  id="username"
                  formControlName="username"
                  class="form-control"
                />
                @if (username?.invalid && (username?.dirty ||
                username?.touched)) {
                <div class="form-error">
                  @if (username?.errors?.['required']) {
                  <span>Username is required</span>
                  }
                </div>
                }
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="form-control"
                  [disabled]="true"
                />
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select
                  id="gender"
                  formControlName="gender"
                  class="form-control"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="imageUrl">Profile Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  formControlName="imageUrl"
                  class="form-control"
                />
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="profileForm.invalid || isUpdating"
                >
                  {{ isUpdating ? "Updating..." : "Save Changes" }}
                </button>
              </div>
            </form>
          </div>
          }

          <!-- Orders Tab -->
          @if (activeTab === 'orders') {
          <div class="profile-section">
            <h2>My Orders</h2>

            @if (cancelSuccess) {
            <div class="alert alert-success">Order cancelled successfully!</div>
            } @if (cancelError) {
            <div class="alert alert-danger">{{ cancelError }}</div>
            } @if (loading) {
            <div class="loading">Loading your orders...</div>
            } @else if (orders.length === 0) {
            <div class="no-orders">
              <p>You haven't placed any orders yet.</p>
            </div>
            } @else {
            <div class="orders-list">
              @for (order of orders; track order.id) {
              <div class="order-card">
                <div class="order-header">
                  <div>
                    <h3>Order #{{ order.id }}</h3>
                    <p class="order-date">
                      {{ order.createdAt | date : "medium" }}
                    </p>
                  </div>
                  <div
                    class="order-status"
                    [ngClass]="'status-' + order.status"
                  >
                    {{ order.status }}
                  </div>
                </div>

                <div class="order-items">
                  @for (item of order.items; track item.productId) {
                  <div class="order-item">
                    <span>{{ item.productTitle }} (x{{ item.quantity }})</span>
                    <span class="float-right">{{ item.price.toFixed(2) }}</span>
                  </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="order-total">
                    Total: {{ order.totalPrice.toFixed(2) }}
                  </div>

                  @if (order.status === 'pending') {
                  <button
                    class="btn btn-danger btn-sm"
                    (click)="cancelOrder(order.id)"
                    [disabled]="isCancelling"
                  >
                    {{ isCancelling ? "Cancelling..." : "Cancel Order" }}
                  </button>
                  }
                </div>
              </div>
              }
            </div>
            }
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      h1 {
        margin-bottom: 2rem;
        color: #333;
      }

      .profile-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
      }

      .profile-sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .profile-card {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        text-align: center;
      }

      .profile-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 1.5rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .profile-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .profile-card h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #333;
      }

      .profile-card p {
        color: #666;
      }

      .profile-menu {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .menu-item {
        display: block;
        width: 100%;
        padding: 1rem 1.5rem;
        text-align: left;
        background: none;
        border: none;
        border-bottom: 1px solid #eee;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .menu-item:last-child {
        border-bottom: none;
      }

      .menu-item:hover {
        background-color: #f8f9fa;
      }

      .menu-item.active {
        background-color: #f0f5ff;
        color: #3366cc;
        font-weight: 500;
        border-left: 3px solid #3366cc;
      }

      .profile-main {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 2rem;
      }

      .profile-section h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: #333;
      }

      .form-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        margin-top: 2rem;
      }

      .loading,
      .no-orders {
        text-align: center;
        padding: 2rem 0;
        color: #666;
      }

      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .order-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background-color: #f8f9fa;
        border-bottom: 1px solid #eee;
      }

      .order-header h3 {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        color: #333;
      }

      .order-date {
        font-size: 0.875rem;
        color: #666;
      }

      .order-status {
        font-weight: 500;
        border-radius: 4px;
        padding: 0.25rem 0.75rem;
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

      .order-items {
        padding: 1rem 1.5rem;
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }

      .order-item:last-child {
        border-bottom: none;
      }

      .float-right {
        float: right;
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background-color: #f8f9fa;
        border-top: 1px solid #eee;
      }

      .order-total {
        font-weight: 600;
        color: #333;
      }

      .btn-sm {
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        .profile-content {
          grid-template-columns: 1fr;
        }

        .profile-sidebar {
          margin-bottom: 1.5rem;
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  orders: Order[] = [];
  loading = true;
  isUpdating = false;
  isCancelling = false;
  updateSuccess = false;
  updateError = "";
  cancelSuccess = false;
  cancelError = "";
  activeTab = "info";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    this.profileForm = this.fb.group({
      username: ["", Validators.required],
      email: [{ value: "", disabled: true }],
      gender: [""],
      imageUrl: [""],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserOrders();
  }

  get username() {
    return this.profileForm.get("username");
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        gender: this.user.gender || "",
        imageUrl: this.user.imageUrl || "",
      });
    }
  }

  loadUserOrders(): void {
    this.loading = true;

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading orders", error);
        this.loading = false;
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = "";

    const updatedUser: Partial<User> = {
      username: this.profileForm.value.username,
      gender: this.profileForm.value.gender || undefined,
      imageUrl: this.profileForm.value.imageUrl || undefined,
    };

    this.authService.updateUserProfile(updatedUser).subscribe({
      next: (user) => {
        this.user = user;
        this.isUpdating = false;
        this.updateSuccess = true;

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.updateError =
          error.message || "Failed to update profile. Please try again.";
      },
    });
  }

  cancelOrder(orderId: string): void {
    this.isCancelling = true;
    this.cancelSuccess = false;
    this.cancelError = "";

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.isCancelling = false;
        this.cancelSuccess = true;

        // Reload orders to reflect the cancelled order
        this.loadUserOrders();

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.cancelSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.isCancelling = false;
        this.cancelError =
          error.message || "Failed to cancel order. Please try again.";
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Reset any success/error messages when switching tabs
    this.updateSuccess = false;
    this.updateError = "";
    this.cancelSuccess = false;
    this.cancelError = "";

    // Reload orders when switching to the orders tab
    if (tab === "orders") {
      this.loadUserOrders();
    }
  }
}
