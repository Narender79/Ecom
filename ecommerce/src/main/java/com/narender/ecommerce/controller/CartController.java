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
}
