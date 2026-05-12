package com.narender.ecommerce.config;

import com.narender.ecommerce.controller.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RequestPredicates.*;
import static org.springframework.web.servlet.function.RouterFunctions.route;

@Configuration
public class Routes {

    private final AuthController authController;
    private final UserController userController;
    private final ProductController productController;
    private final CartController cartController;
    private final OrderController orderController;

    public Routes(AuthController authController, UserController userController,
                  ProductController productController, CartController cartController,
                  OrderController orderController) {
        this.authController = authController;
        this.userController = userController;
        this.productController = productController;
        this.cartController = cartController;
        this.orderController = orderController;
    }

    @Bean
    public RouterFunction<ServerResponse> apiRoutes() {
        return route(POST("/api/auth/register"), authController::register)
                .andRoute(POST("/api/auth/login"), authController::login)
                
                .andRoute(GET("/api/users/me"), userController::getMe)
                .andRoute(GET("/api/users/{id}"), userController::getUserById)
                .andRoute(POST("/api/users/settings"), userController::updateSettings)
                
                .andRoute(GET("/api/products"), productController::getAllProducts)
                .andRoute(GET("/api/products/{id}"), productController::getProductById)
                .andRoute(POST("/api/products"), productController::addProduct)
                .andRoute(PUT("/api/products/{id}"), productController::updateProduct)
                .andRoute(DELETE("/api/products/{id}"), productController::deleteProduct)
                
                .andRoute(GET("/api/cart"), cartController::getCart)
                .andRoute(POST("/api/cart"), cartController::addToCart)
                .andRoute(PUT("/api/cart/{id}"), cartController::updateCart)
                .andRoute(DELETE("/api/cart/{id}"), cartController::removeFromCart)
                
                .andRoute(GET("/api/orders"), orderController::getOrders)
                .andRoute(POST("/api/orders"), orderController::createOrder)
                .andRoute(GET("/api/orders/{id}"), orderController::getOrderById);
    }
}