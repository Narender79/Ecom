package com.narender.ecommerce.service.payment;

import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.Order;
import org.springframework.web.servlet.function.ServerResponse;

public interface PaymentStrategy {
    String getMethodName(); // e.g. "COD", "RAZORPAY"
    ServerResponse processPayment(Order order, OrderRequest request) throws Exception;
    ServerResponse verifyPayment(Order order, PaymentVerificationRequest request) throws Exception;
}
