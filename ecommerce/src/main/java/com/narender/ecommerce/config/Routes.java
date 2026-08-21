package com.narender.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static org.springframework.web.servlet.function.RequestPredicates.DELETE;
import static org.springframework.web.servlet.function.RequestPredicates.GET;
import static org.springframework.web.servlet.function.RequestPredicates.POST;
import static org.springframework.web.servlet.function.RequestPredicates.PUT;
import org.springframework.web.servlet.function.RouterFunction;
import static org.springframework.web.servlet.function.RouterFunctions.route;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.controller.AuthController;
import com.narender.ecommerce.controller.CartController;
import com.narender.ecommerce.controller.OrderController;
import com.narender.ecommerce.controller.ProductController;
import com.narender.ecommerce.controller.UserController;

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
        return route(POST("/api/auth/register"), req -> authController.register(req))
                .andRoute(POST("/api/auth/login"), req -> authController.login(req))

                .andRoute(GET("/api/users/me"), req -> userController.getMe(req))
                .andRoute(GET("/api/users/{id}"), req -> userController.getUserById(req))
                .andRoute(POST("/api/users/settings"), req -> userController.updateSettings(req))

                .andRoute(GET("/api/products"), req -> productController.getAllProducts(req))
                .andRoute(GET("/api/products/featured"), req -> productController.getFeatureProduct(req))
                .andRoute(GET("/api/products/{id}"), req -> productController.getAllProducts(req))
                .andRoute(POST("/api/products"), req -> productController.addProduct(req))
                .andRoute(PUT("/api/products/{id}"), req -> productController.updateProduct(req))
                .andRoute(DELETE("/api/products/{id}"), req -> productController.deleteProduct(req))

                .andRoute(GET("/api/cart"), req -> cartController.getCart(req))
                .andRoute(POST("/api/cart"), req -> cartController.addToCart(req))
                .andRoute(PUT("/api/cart/{id}"), req -> cartController.updateCart(req))
                .andRoute(DELETE("/api/cart/{id}"), req -> cartController.removeFromCart(req))

                .andRoute(GET("/api/orders"), req -> orderController.getOrders(req))
                .andRoute(POST("/api/orders"), req -> orderController.createOrder(req))
                .andRoute(GET("/api/orders/{id}"), req -> orderController.getOrderById(req))
                .andRoute(GET("/api/orders"), req -> orderController.getOrders(req))
                .andRoute(POST("/api/orders"), req -> orderController.createOrder(req))
                .andRoute(GET("/api/orders/{id}"), req -> orderController.getOrderById(req))
                .andRoute(POST("/api/orders/{id}/verify-payment"), req -> orderController.verifyPayment(req));
            }
}