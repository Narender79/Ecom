🛍️ Project Overview: E-Commerce Web Application (EcomHub)
This repository is a full-stack E-Commerce Application consisting of:

Backend (/ecommerce): A Spring Boot (Java 21) REST & Functional API powered by PostgreSQL, Spring Data JPA/Hibernate, Spring Security with JWT, and Razorpay Payment Gateway integration.
Frontend (/ecommerce-frontend): A React 19 SPA styled with Tailwind CSS, featuring dynamic state management via React Context, client-side routing with React Router v6, Axios with request interceptors, and a Razorpay Checkout integration.
🏛️ Overall Architecture & Data Flow
+-------------------------------------------------------------------------------+
|                             FRONTEND (React 19 SPA)                           |
|  [Pages: Home, Products, Cart, Checkout, Profile, Auth]                       |
|  [Context: AuthContext (JWT/Guest Sync), CartContext (Dual-Mode State)]       |
|  [Service Layer: Axios API Client + Bearer Token Interceptor]                 |
+---------------------------------------+---------------------------------------+
                                        | HTTP / JSON (CORS Enabled)
                                        v
+-------------------------------------------------------------------------------+
|                           BACKEND (Spring Boot 4 / Java 21)                   |
|                                                                               |
|  [Security Filter Chain]  -->  JwtAuthenticationFilter (OncePerRequestFilter) |
|                                                                               |
|  [Functional Routing]     -->  Routes.java (RouterFunction / ServerResponse)  |
|                                                                               |
|  [Controllers/Handlers]   -->  AuthController, ProductController,             |
|                                CartController, OrderController, UserController|
|                                                                               |
|  [Service Layer]          -->  AuthService, FeaturedProductService,           |
|                                OrderService, PaymentStrategy (COD / Razorpay) |
|                                                                               |
|  [Data Access Layer]      -->  Spring Data JPA Repositories                   |
|                                                                               |
|  [Database]               -->  PostgreSQL (ecommerce_db)                      |
+-------------------------------------------------------------------------------+
⚙️ Backend Architecture & Patterns (/ecommerce)
The backend is built around clean layered architecture combined with modern functional programming and design patterns:

1. Design Patterns Followed in Backend
Strategy Pattern (Payment Processing):



PaymentStrategy.java
 defines a common payment processing contract (getMethodName(), processPayment(), verifyPayment()).
Implemented by:


CodPaymentStrategy.java
: Handles Cash on Delivery directly.


RazorpayPaymentStrategy.java
: Initiates Razorpay orders and cryptographically verifies HMAC signatures (razorpay_order_id|razorpay_payment_id).


OrderService.java
 injects List<PaymentStrategy> and dynamically collects them into a Map<String, PaymentStrategy> for runtime strategy resolution based on the user's selected method.
Functional Endpoints / Router Pattern:

Instead of standard Spring @RestController method annotations, routing is explicitly mapped using Spring WebMvc Functional Routing in 

Routes.java
 (RouterFunction<ServerResponse>).
Controllers expose handler functions taking ServerRequest and returning ServerResponse.
Stateless JWT Filter Pattern (Security):



SecurityConfig.java
 establishes a stateless session (SessionCreationPolicy.STATELESS) with CORS configuration.


JwtAuthenticationFilter.java
 extends OncePerRequestFilter to extract Bearer tokens from incoming headers, validate with 

JwtTokenProvider.java
, and inject user details into Spring Security's SecurityContextHolder.
Repository Pattern (Data Access Layer):

Leverages Spring Data JPA interfaces extending JpaRepository for type-safe queries and custom derivations like findTop4ByOrderBySoldCountDesc() for featured products.
DTO Pattern & Standardized Response Wrapper:

Clean separation between internal database models and external requests (

OrderRequest.java
, 

RegisterRequest.java
, 

LoginRequest.java
, 

PaymentVerificationRequest.java
).


ApiResponse.java
 provides a uniform { message, success, data } JSON response wrapper across all API endpoints.
Database Seeding (CommandLineRunner):



DataInitializer.java
 populates initial catalog products and sales tracking records upon application boot.
2. Backend Package Structure
ecommerce/src/main/java/com/narender/ecommerce/
├── EcommerceApplication.java           # Spring Boot Main Entry Point
├── config/
│   ├── DataInitializer.java           # Seeds initial demo products & sales
│   ├── Routes.java                    # Functional RouterFunction endpoint registry
│   └── SecurityConfig.java            # SecurityFilterChain, BCrypt, CORS, stateless config
├── controller/
│   ├── AuthController.java            # Registration and Login handlers
│   ├── CartController.java            # Cart query, add, update, remove handlers
│   ├── OrderController.java           # Order creation, history, and payment verification
│   ├── ProductController.java         # Product CRUD and featured product handlers
│   └── UserController.java            # Profile & settings handlers
├── dto/
│   ├── ApiResponse.java               # Standard API response container
│   ├── CartItemRequest.java           # Cart payload DTO
│   ├── LoginRequest.java              # User login credentials DTO
│   ├── OrderRequest.java              # Checkout & shipping details DTO
│   ├── PaymentVerificationRequest.java# Razorpay signature verification DTO
│   ├── ProductRequest.java            # Product create/update DTO
│   └── RegisterRequest.java           # User signup DTO
├── model/
│   ├── Address.java                   # Shipping address entity
│   ├── CartItem.java                  # Cart item entity (User <-> Product)
│   ├── Order.java                     # Order entity with payment statuses & items
│   ├── OrderItem.java                 # Individual order line item entity
│   ├── Product.java                   # Product entity (name, category, price, imageUrl)
│   ├── ProductSale.java               # Sales counter entity for top-sellers
│   └── User.java                      # User entity (name, email, hashed password)
├── repository/
│   ├── AddressRepository.java
│   ├── CartItemRepository.java
│   ├── OrderRepository.java
│   ├── ProductRepository.java
│   ├── ProductSaleRepository.java
│   └── UserRepository.java
├── security/
│   ├── CustomUserDetailsService.java  # User loading for Spring Security
│   ├── JwtAuthenticationFilter.java   # Bearer token validation filter
│   └── JwtTokenProvider.java          # HMAC-SHA token generation and parsing
└── service/
    ├── AuthService.java               # Register, login, password hashing logic
    ├── FeaturedProductService.java    # Top-selling product aggregator
    ├── OrderService.java              # Order orchestration & strategy delegator
    ├── PaymentStrategy.java           # Payment Strategy Interface
    └── payment/
        ├── CodPaymentStrategy.java    # Cash on Delivery strategy
        └── RazorpayPaymentStrategy.java# Razorpay API & HMAC signature verification strategy
🎨 Frontend Architecture & Patterns (/ecommerce-frontend)
The frontend is structured as a modular, responsive Single Page Application (SPA) in React 19.

1. Design Patterns Followed in Frontend
Context & Provider Pattern (Global State Management):



AuthContext.jsx
: Centralized authentication context storing JWT token and user info. Synchronizes with localStorage and automatically validates sessions against /api/users/me on startup.


CartContext.jsx
: Comprehensive cart management providing cartItems, addToCart, removeFromCart, updateQuantity, totalItems, and totalPrice.
Guest-to-User Cart Migration Pattern: When an unauthenticated visitor adds items to their cart (stored in localStorage under guestCart), upon logging in or registering, 

AuthContext.jsx
 automatically merges the guest items into the database cart via /api/cart and clears the local guest storage.
Axios Interceptor Pattern:



api.js
 configures a centralized Axios instance. A request interceptor automatically pulls the JWT token from localStorage and attaches Authorization: Bearer <token> to all API requests.
Route Protection / Guard Pattern:



ProtectedRoute.jsx
 wraps authenticated routes (/profile, /checkout/address, /checkout/payment, /orders/:orderId), redirecting unauthenticated users to /login.
Service Layer Pattern:



productService.js
 abstracts API calls for fetching all products and featured products away from UI components.
Dynamic Script Loader Pattern:



CheckoutPayment.jsx
 dynamically loads Razorpay's checkout.js on-demand before initializing the payment modal.
Component-Driven UI with Tailwind CSS:

Reusable UI components (

ProductCard.jsx
, 

HeroCarousel.jsx
, 

Navbar.jsx
, 

Footer.jsx
).
2. Frontend Directory Structure
ecommerce-frontend/src/
├── App.js                     # Root layout, route configuration & providers
├── index.js                   # Application entry point
├── index.css                  # Tailwind CSS root directives
├── components/
│   ├── Footer.jsx             # Multi-column footer with social & support links
│   ├── HeroCarousel.jsx       # Auto-rotating promotional carousel banner
│   ├── Navbar.jsx             # Sticky top navigation with cart counter & user status
│   ├── ProductCard.jsx        # Reusable product display card
│   └── ProtectedRoute.jsx     # Route authentication guard
├── context/
│   ├── AuthContext.jsx        # Auth state, login/register/logout & guest cart merger
│   └── CartContext.jsx        # Dual-mode (Guest/User) cart state & calculations
├── pages/
│   ├── Cart.jsx               # Cart inspection, quantity updater & subtotal
│   ├── CheckoutAddress.jsx    # Step 1: Shipping address collection form
│   ├── CheckoutPayment.jsx    # Step 2: Payment method selection & Razorpay checkout
│   ├── Home.jsx               # Landing page (Hero, Categories, Top Deals, Banners)
│   ├── Login.jsx              # User sign-in page
│   ├── OrderDetails.jsx       # Individual order breakdown & tracking details
│   ├── ProductList.jsx        # Catalog with search & filter functionality
│   ├── Profile.jsx            # User dashboard, order history list & support info
│   └── Register.jsx           # User registration page
└── services/
    ├── api.js                 # Axios instance with JWT interceptor
    └── productService.js      # Product-specific API service functions
🔄 End-to-End Core Workflows
1. Authentication & Session Flow
User enters credentials on /register or /login.
Backend 

AuthService.java
 validates input, uses BCryptPasswordEncoder to verify/hash passwords, and returns a signed JWT token via 

JwtTokenProvider.java
.


AuthContext.jsx
 saves the token to localStorage and triggers the guest cart merge.
Subsequent requests automatically include the Bearer token via 

api.js
.
2. Multi-Step Checkout & Payment Flow
Cart Review (/cart): User reviews items and proceeds to checkout.
Shipping Address (/checkout/address): User enters shipping address details, validated and stored in session state.
Payment Choice (/checkout/payment):
If Cash on Delivery (COD):
Dispatches POST /api/orders with paymentMethod: "COD".


CodPaymentStrategy.java
 creates the order with status Processing/Paid, clears the user's cart in the database, and confirms the order.
If Online Payment (Razorpay):
Dispatches POST /api/orders with paymentMethod: "RAZORPAY".


RazorpayPaymentStrategy.java
 communicates with the Razorpay API to generate a razorpayOrderId and returns order details to the client.
The frontend launches the native Razorpay modal.
Upon payment completion in the modal, frontend calls POST /api/orders/{id}/verify-payment.
Backend cryptographically verifies the payment signature using the Razorpay secret key. If valid, order status is updated to Paid and the cart is cleared.
3. Featured Products Algorithm
Products are ranked based on the product_sales entity count via 

FeaturedProductService.java
 (productSaleRepository.findTop4ByOrderBySoldCountDesc()), allowing the home page to always feature best-selling items dynamically.
I am completely familiar with all aspects of this codebase, from the functional routing and payment strategy in the Spring Boot backend to the dual-state cart management and Razorpay checkout in the React frontend. Let me know what you would like to work on next!
