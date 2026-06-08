package com.narender.ecommerce.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.CartItemRequest;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @GetMapping
    public ResponseEntity<?> getCart() {
        return ResponseEntity.ok(new ApiResponse("Cart retrieved", true));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Object cartItem) {
        return ResponseEntity.ok(new ApiResponse("Item added to cart", true));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCart(@PathVariable Long id, @RequestBody Object cartItem) {
        return ResponseEntity.ok(new ApiResponse("Cart updated", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Item removed from cart", true));
    }

    // Handler methods for functional routing
    public ServerResponse getCartHandler(ServerRequest request) throws Exception {
        return ServerResponse.ok().body(new ApiResponse("Cart retrieved", true));
    }

    public ServerResponse addToCartHandler(ServerRequest request) throws Exception {
        CartItemRequest body = request.body(CartItemRequest.class);
        return ServerResponse.ok().body(new ApiResponse("Item added to cart", true));
    }

    public ServerResponse updateCartHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        Object body = request.body(Object.class);
        return ServerResponse.ok().body(new ApiResponse("Cart updated", true));
    }

    public ServerResponse removeFromCartHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return ServerResponse.ok().body(new ApiResponse("Item removed from cart", true));
    }
}
