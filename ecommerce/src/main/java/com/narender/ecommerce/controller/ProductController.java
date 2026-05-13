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

import com.narender.ecommerce.dto.ProductRequest;

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

    // Handler methods for functional routing
    public ServerResponse getAllProductsHandler(ServerRequest request) throws Exception {
        return ServerResponse.ok().body(new ApiResponse("Products retrieved", true));
    }

    public ServerResponse getProductByIdHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return ServerResponse.ok().body(new ApiResponse("Product retrieved", true));
    }

    public ServerResponse addProductHandler(ServerRequest request) throws Exception {
        ProductRequest body = request.body(ProductRequest.class);
        return ServerResponse.ok().body(new ApiResponse("Product added", true));
    }

    public ServerResponse updateProductHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        Object body = request.body(Object.class);
        return ServerResponse.ok().body(new ApiResponse("Product updated", true));
    }

    public ServerResponse deleteProductHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return ServerResponse.ok().body(new ApiResponse("Product deleted", true));
    }
}
