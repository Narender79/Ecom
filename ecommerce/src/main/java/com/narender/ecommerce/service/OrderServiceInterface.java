package com.narender.ecommerce.service;

import org.springframework.web.servlet.function.ServerResponse;
import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.User;

public interface  OrderServiceInterface {
    ServerResponse createOrder(User user, OrderRequest request) throws Exception;
    ServerResponse verifyPayment (Long orderId, PaymentVerificationRequest request) throws Exception;
}
