package com.narender.ecommerce.service.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.repository.CartItemRepository;
import com.narender.ecommerce.repository.OrderRepository;

@Component
public class CodPaymentStrategy implements PaymentStrategy {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public String getMethodName() {
        return "COD";
    }

    @Override
    public ServerResponse processPayment(Order order, OrderRequest request) throws Exception {
        order.setStatus("Processing");
        order.setPaymentStatus("Paid"); // COD payment processed on checkout
        Order savedOrder = orderRepository.save(order);

        // Clear cart immediately for COD
        cartItemRepository.deleteByUserId(order.getUser().getId());

        return ServerResponse.ok().body(new ApiResponse("Order placed successfully (COD)", true, savedOrder));
    }

    @Override
    public ServerResponse verifyPayment(Order order, PaymentVerificationRequest request) throws Exception {
        return ServerResponse.badRequest().body(new ApiResponse("Payment verification not required for Cash on Delivery", false));
    }
}
