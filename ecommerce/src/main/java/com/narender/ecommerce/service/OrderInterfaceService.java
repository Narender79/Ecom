package com.narender.ecommerce.service;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.PlaceOrderRequest;
import com.narender.ecommerce.model.User;

public interface OrderInterfaceService {
    ApiResponse placeOrder(User user, PlaceOrderRequest req);
    ApiResponse listOrders(User user);
    ApiResponse getOrder(User user,Long orderId);
}
