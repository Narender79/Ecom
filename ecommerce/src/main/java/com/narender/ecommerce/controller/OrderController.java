package com.narender.ecommerce.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;
import com.narender.ecommerce.dto.PlaceOrderRequest;
import com.narender.ecommerce.security.CurrentUserProvider;
import com.narender.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService; private final CurrentUserProvider currentUser;
    public OrderController(OrderService orderService, CurrentUserProvider currentUser){ this.orderService=orderService; this.currentUser=currentUser; }

    public ServerResponse getOrdersHandler(ServerRequest req){ return ServerResponse.ok().body(orderService.listOrders(currentUser.get())); }
    public ServerResponse createOrderHandler(ServerRequest req) throws Exception { return ServerResponse.ok().body(orderService.placeOrder(currentUser.get(), req.body(PlaceOrderRequest.class))); }
    public ServerResponse getOrderByIdHandler(ServerRequest req){ return ServerResponse.ok().body(orderService.getOrder(currentUser.get(), Long.parseLong(req.pathVariable("id")))); }
}