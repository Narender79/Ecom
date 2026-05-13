package com.narender.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping
    public ResponseEntity<?> getOrders() {
        return ResponseEntity.ok(new ApiResponse("Orders retrieved", true));
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Object orderRequest) {
        return ResponseEntity.ok(new ApiResponse("Order created", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse("Order retrieved", true));
    }

    // Handler methods for functional routing
    public ServerResponse getOrdersHandler(ServerRequest request) throws Exception {
        return ServerResponse.ok().body(new ApiResponse("Orders retrieved", true));
    }

    public ServerResponse createOrderHandler(ServerRequest request) throws Exception {
        Object body = request.body(Object.class);
        return ServerResponse.ok().body(new ApiResponse("Order created", true));
    }

    public ServerResponse getOrderByIdHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return ServerResponse.ok().body(new ApiResponse("Order retrieved", true));
    }
}