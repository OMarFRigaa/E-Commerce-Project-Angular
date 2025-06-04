import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <header class="about-header">
        <h1>About Our Store</h1>
        <p>Learn more about our mission and values</p>
      </header>
      
      <section class="about-section">
        <h2>Our Story</h2>
        <div class="about-content">
          <div class="about-image">
            <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Our team" />
          </div>
          <div class="about-text">
            <p>
              Founded in 2023, our e-commerce store was born from a passion for delivering high-quality products at reasonable prices. 
              What started as a small operation has grown into a trusted online retailer serving customers worldwide.
            </p>
            <p>
              We believe in the power of technology to connect people with products they love. Our mission is to provide an 
              exceptional shopping experience with a curated selection of products, competitive prices, and outstanding customer service.
            </p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2>Our Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🌟</div>
            <h3>Quality</h3>
            <p>We carefully select every product in our catalog to ensure it meets our high standards for quality and performance.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Trust</h3>
            <p>We build long-lasting relationships with our customers based on transparency, reliability, and honest business practices.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">🌍</div>
            <h3>Sustainability</h3>
            <p>We are committed to reducing our environmental footprint and offering eco-friendly product options whenever possible.</p>
          </div>
          
          <div class="value-card">
            <div class="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>We continuously strive to improve our platform and bring the latest technologies and products to our customers.</p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2>Our Team</h2>
        <p class="section-intro">
          Behind our store is a dedicated team of professionals who are passionate about creating the best possible shopping experience for our customers.
        </p>
        <div class="team-grid">
          <div class="team-member">
            <div class="team-photo">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team member" />
            </div>
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          
          <div class="team-member">
            <div class="team-photo">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team member" />
            </div>
            <h3>Jane Smith</h3>
            <p>Head of Product</p>
          </div>
          
          <div class="team-member">
            <div class="team-photo">
              <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Team member" />
            </div>
            <h3>Michael Johnson</h3>
            <p>Customer Support Manager</p>
          </div>
          
          <div class="team-member">
            <div class="team-photo">
              <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Team member" />
            </div>
            <h3>Lisa Chen</h3>
            <p>Operations Director</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .about-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .about-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .about-header p {
      font-size: 1.25rem;
      color: #666;
    }
    
    .about-section {
      margin-bottom: 4rem;
    }
    
    .about-section h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #333;
      position: relative;
      padding-bottom: 0.5rem;
    }
    
    .about-section h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background-color: #3366CC;
    }
    
    .section-intro {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 2rem;
      max-width: 800px;
    }
    
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }
    
    .about-image img {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .about-text p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 1rem;
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .value-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem 1.5rem;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .value-card:hover {
      transform: translateY(-5px);
    }
    
    .value-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .value-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    .value-card p {
      font-size: 0.95rem;
      line-height: 1.5;
      color: #666;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .team-member {
      text-align: center;
    }
    
    .team-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .team-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .team-member h3 {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
      color: #333;
    }
    
    .team-member p {
      color: #666;
      font-size: 0.95rem;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .about-content {
        grid-template-columns: 1fr;
      }
      
      .about-image {
        margin-bottom: 1.5rem;
      }
      
      .values-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .values-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {}