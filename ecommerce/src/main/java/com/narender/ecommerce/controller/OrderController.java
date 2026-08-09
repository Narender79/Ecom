package com.narender.ecommerce.controller;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.model.Address;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.model.OrderItem;
import com.narender.ecommerce.model.CartItem;
import com.narender.ecommerce.repository.OrderRepository;
import com.narender.ecommerce.repository.UserRepository;
import com.narender.ecommerce.repository.CartItemRepository;
import com.narender.ecommerce.repository.AddressRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ServerResponse getOrders(ServerRequest request) {
        User user = getAuthenticatedUser();
        List<Order> orders = orderRepository.findByUserId(user.getId());
        return ServerResponse.ok().body(new ApiResponse("Orders retrieved", true, orders));
    }

    @PostMapping
    @Transactional
    public ServerResponse createOrder(ServerRequest request) throws Exception {
        User user = getAuthenticatedUser();

        // 1. Fetch the user's current cart items
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            return ServerResponse.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Cart is empty", false));
        }
        // 2. Parse and save the shipping address from request body
        Address addressInput = request.body(Address.class);
        addressInput.setUser(user);
        Address savAddress = addressRepository.save(addressInput);

        // 3. Calculate the total order cost
        double total = cartItems.stream().mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity()).sum();

        // 4. Create the new Order
        Order order = new Order();
        order.setUser(user);
        order.setAddress(savAddress);

        order.setOrderNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setTotal(total);
        order.setStatus("Processing");
        order.setCreatedAt(LocalDateTime.now());

        // 5. Convert each CartItem into an OrderItem and link to the Order
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem(order, cartItem.getProduct(), cartItem.getQuantity(),
                    cartItem.getProduct().getPrice());
            order.addItem(orderItem);
        }
        // 6. Save the Order (cascades and saves all OrderItem records too!)
        Order savedOrder = orderRepository.save(order);

        // 7. Clear the user's shopping cart
        cartItemRepository.deleteByUserId(user.getId());
        return ServerResponse.ok().body(new ApiResponse("Order placed successfully", true, savedOrder));
    }

    @GetMapping("/{id}")
    public ServerResponse getOrderById(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return orderRepository.findById(id)
                .map(order -> ServerResponse.ok().body(new ApiResponse("Order retrieved", true, order)))
                .orElseGet(() -> ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Order not found", false)));
    }
}