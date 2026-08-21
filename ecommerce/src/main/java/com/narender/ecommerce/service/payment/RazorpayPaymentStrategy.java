package com.narender.ecommerce.service.payment;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.repository.CartItemRepository;
import com.narender.ecommerce.repository.OrderRepository;
import com.razorpay.RazorpayClient;

@Component
public class RazorpayPaymentStrategy implements PaymentStrategy {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public String getMethodName() {
        return "RAZORPAY";
    }

    @Override
    public ServerResponse processPayment(Order order, OrderRequest request) throws Exception {
        order.setStatus("Pending Payment");
        order.setPaymentStatus("Pending");

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) Math.round(order.getTotal() * 100)); // paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getOrderNumber());

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
            order.setRazorpayOrderId(razorpayOrder.get("id"));
        } catch (Exception e) {
            return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to initiate Razorpay order: " + e.getMessage(), false));
        }

        Order savedOrder = orderRepository.save(order);

        // Map payload for client redirections
        Map<String, Object> data = new HashMap<>();
        data.put("id", savedOrder.getId());
        data.put("orderNumber", savedOrder.getOrderNumber());
        data.put("total", savedOrder.getTotal());
        data.put("razorpayOrderId", savedOrder.getRazorpayOrderId());
        data.put("amount", (int) Math.round(savedOrder.getTotal() * 100));
        data.put("keyId", razorpayKeyId);

        return ServerResponse.ok().body(new ApiResponse("Order initiated. Redirecting to payment...", true, data));
    }

    @Override
    public ServerResponse verifyPayment(Order order, PaymentVerificationRequest request) throws Exception {
        try {
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options,razorpayKeySecret);

            if (isValid) {
                order.setStatus("Processing");
                order.setPaymentStatus("Paid");
                order.setRazorpayPaymentId(request.getRazorpayPaymentId());
                order.setRazorpaySignature(request.getRazorpaySignature());
                orderRepository.save(order);

                // Clear cart only AFTER signature validation succeeds
                cartItemRepository.deleteByUserId(order.getUser().getId());

                return ServerResponse.ok().body(new ApiResponse("Payment verified successfully", true));
            }
            
            return ServerResponse.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Invalid payment signature", false));
        } catch (Exception e) {
            return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Payment verification failed: " + e.getMessage(), false));
        }
    }
}
