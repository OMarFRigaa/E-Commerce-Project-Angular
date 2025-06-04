import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>E-commerce Friga Store</h3>
          <p>Your one-stop shop for amazing products at great prices.</p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/about">About</a></li>
            <li><a routerLink="/products">Products</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Help</h4>
          <ul>
            <li><a routerLink="/">FAQ</a></li>
            <li><a routerLink="/">Shipping</a></li>
            <li><a routerLink="/">Returns</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email: Omarfriga&#64;gmail.com</li>
            <li>Phone: 0111-104-7751</li>
            <li>Address: 123 Commerce St, Shopping City Elsyof</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 E-commerce Store. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background-color: #2c3e50;
        color: #ecf0f1;
        padding-top: 2rem;
        margin-top: 2rem;
      }

      .footer-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem 2rem;
      }

      .footer-section h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: white;
      }

      .footer-section h4 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: white;
      }

      .footer-section p {
        line-height: 1.6;
      }

      .footer-section ul {
        list-style: none;
        padding: 0;
      }

      .footer-section ul li {
        margin-bottom: 0.5rem;
      }

      .footer-section ul li a {
        color: #ecf0f1;
        text-decoration: none;
        transition: color 0.3s;
      }

      .footer-section ul li a:hover {
        color: #3498db;
        text-decoration: underline;
      }

      .footer-bottom {
        background-color: #1a252f;
        padding: 1.5rem;
        text-align: center;
      }

      .footer-bottom p {
        margin: 0;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class FooterComponent {}
