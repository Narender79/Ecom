# E-Commerce Platform

A full-stack e-commerce application built with **Spring Boot** and **React**.  
The application allows users to browse products, manage their cart, authenticate, place orders, make payments, and view their order history and profile.

---

## 🚀 Features

### User Management
- User registration
- User login and authentication
- Password encryption using Spring Security
- User profile management
- Protected routes for authenticated users

### Product Management
- Browse products
- Search and filter products
- Featured products
- Product availability tracking
- Product sales tracking

### Shopping Cart
- Add products to cart
- Update product quantity
- Remove products from cart
- Cart summary
- Guest cart support
- Cart persistence for authenticated users
- Guest cart merging after login

### Orders
- Checkout flow
- Address management during checkout
- Order creation
- Order details
- Order history

### Payment
- Checkout payment flow
- Payment processing integration

---

# 🏗️ Architecture

The project follows a layered architecture.

```text
                    React Frontend
                          │
                          │ REST API
                          ▼
                 Spring Boot Backend
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
         Controller     Service     Security
             │            │
             │            ▼
             │       Repository
             │            │
             └────────────┼────────────┐
                          ▼            │
                       PostgreSQL      │
