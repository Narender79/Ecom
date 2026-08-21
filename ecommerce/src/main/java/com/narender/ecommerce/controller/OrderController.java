package com.narender.ecommerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.OrderRepository;
import com.narender.ecommerce.repository.UserRepository;
import com.narender.ecommerce.service.OrderService;

@RestController
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderService orderService;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ServerResponse getOrders(ServerRequest request) {
        User user = getAuthenticatedUser();
        List<Order> orders = orderRepository.findByUserId(user.getId());
        return ServerResponse.ok().body(new ApiResponse("Orders retrieved", true, orders));
    }

    public ServerResponse createOrder(ServerRequest request) throws Exception {
        User user = getAuthenticatedUser();
        OrderRequest body = request.body(OrderRequest.class);
        return orderService.createOrder(user, body);
    }

    public ServerResponse getOrderById(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return orderRepository.findById(id)
                .map(order -> ServerResponse.ok().body(new ApiResponse("Order retrieved", true, order)))
                .orElseGet(() -> ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Order not found", false)));
    }

    public ServerResponse verifyPayment(ServerRequest request) throws Exception {
        Long orderId = Long.parseLong(request.pathVariable("id"));
        PaymentVerificationRequest body = request.body(PaymentVerificationRequest.class);
        return orderService.verifyPayment(orderId, body);
    }
}
