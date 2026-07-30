package com.narender.ecommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.PlaceOrderRequest;
import com.narender.ecommerce.model.Address;
import com.narender.ecommerce.model.CartItem;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.model.OrderItem;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.AddressRepository;
import com.narender.ecommerce.repository.CartItemRepository;
import com.narender.ecommerce.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orders; private final CartItemRepository cart; private final AddressRepository addresses;
    public OrderServiceImpl(OrderRepository orders, CartItemRepository cart, AddressRepository addresses){ this.orders=orders; this.cart=cart; this.addresses=addresses; }

    @Override
    @Transactional
    public ApiResponse placeOrder(User user, PlaceOrderRequest req){
        List<CartItem> items = cart.findByUserId(user.getId()); if(items.isEmpty()) return new ApiResponse("Cart is empty", false);
        Address a = addresses.save(new Address(user, req.getFullName(), req.getPhone(), req.getStreet(), req.getCity(), req.getState(), req.getPincode()));
        double total = items.stream().mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity()).sum();
        Order o = new Order(); o.setUser(user); o.setAddress(a); o.setOrderNumber(UUID.randomUUID().toString().substring(0,8).toUpperCase()); o.setTotal(total); o.setStatus("Processing"); o.setCreatedAt(LocalDateTime.now());
        items.forEach(i -> o.addItem(new OrderItem(o, i.getProduct(), i.getQuantity(), i.getProduct().getPrice())));
        Order saved = orders.save(o); cart.deleteByUserId(user.getId()); return new ApiResponse("Order placed successfully", true, saved);
    }

    @Override
    public ApiResponse listOrders(User user){ return new ApiResponse("Orders retrieved", true, orders.findByUserId(user.getId())); }

    @Override
    public ApiResponse getOrder(User user, Long orderId){
        return orders.findById(orderId).filter(o -> o.getUser().getId().equals(user.getId())).map(o -> new ApiResponse("Order retrieved", true, o)).orElseGet(() -> new ApiResponse("Order not found", false));
    }
}