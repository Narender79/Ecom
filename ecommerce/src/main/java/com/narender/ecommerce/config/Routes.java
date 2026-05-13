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
        return route(POST("/api/auth/register"), req -> authController.registerHandler(req))
                .andRoute(POST("/api/auth/login"), req -> authController.loginHandler(req))
                
                .andRoute(GET("/api/users/me"), req -> userController.getMeHandler(req))
                .andRoute(GET("/api/users/{id}"), req -> userController.getUserByIdHandler(req))
                .andRoute(POST("/api/users/settings"), req -> userController.updateSettingsHandler(req))
                
                .andRoute(GET("/api/products"), req -> productController.getAllProductsHandler(req))
                .andRoute(GET("/api/products/{id}"), req -> productController.getProductByIdHandler(req))
                .andRoute(POST("/api/products"), req -> productController.addProductHandler(req))
                .andRoute(PUT("/api/products/{id}"), req -> productController.updateProductHandler(req))
                .andRoute(DELETE("/api/products/{id}"), req -> productController.deleteProductHandler(req))
                
                .andRoute(GET("/api/cart"), req -> cartController.getCartHandler(req))
                .andRoute(POST("/api/cart"), req -> cartController.addToCartHandler(req))
                .andRoute(PUT("/api/cart/{id}"), req -> cartController.updateCartHandler(req))
                .andRoute(DELETE("/api/cart/{id}"), req -> cartController.removeFromCartHandler(req))
                
                .andRoute(GET("/api/orders"), req -> orderController.getOrdersHandler(req))
                .andRoute(POST("/api/orders"), req -> orderController.createOrderHandler(req))
                .andRoute(GET("/api/orders/{id}"), req -> orderController.getOrderByIdHandler(req));
    }
}