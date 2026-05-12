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
@RequestMapping("/api/products")


public class ProductController {
     @GetMapping
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(new ApiResponse("Products retrieved", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Product retrieved", true));
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Object productRequest) {
        return ResponseEntity.ok(new ApiResponse("Product added", true));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Object productRequest) {
        return ResponseEntity.ok(new ApiResponse("Product updated", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Product deleted", true));
    }
}
