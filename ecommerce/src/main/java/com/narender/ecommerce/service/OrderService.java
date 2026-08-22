package com.narender.ecommerce.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.function.ServerResponse;
import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.OrderRequest;
import com.narender.ecommerce.dto.PaymentVerificationRequest;
import com.narender.ecommerce.model.Address;
import com.narender.ecommerce.model.CartItem;
import com.narender.ecommerce.model.Order;
import com.narender.ecommerce.model.OrderItem;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.AddressRepository;
import com.narender.ecommerce.repository.CartItemRepository;
import com.narender.ecommerce.repository.OrderRepository;
import com.narender.ecommerce.service.payment.PaymentStrategy;

@Service
public class OrderService implements OrderServiceInterface {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    private final Map<String, PaymentStrategy> paymentStrategies;

    @Autowired
    public OrderService(List<PaymentStrategy> strategies){
        // here i am collecting into a map grouped by method name (COD , RazorPay)
        this.paymentStrategies = strategies.stream().collect(Collectors.toMap(
            strategy -> strategy.getMethodName().toUpperCase(),
            strategy -> strategy
        ));
    }

    @Override
    @Transactional
    public ServerResponse createOrder(User user, OrderRequest request) throws Exception{
        // fetch user's Cart
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()){
            return ServerResponse.status(HttpStatus.BAD_REQUEST ).body(new ApiResponse("Cart is Empty", false));
        }

        // Resolve the Strategy
        String paymentMethod = request.getPaymentMethod().toUpperCase();
        PaymentStrategy strategy = paymentStrategies.get(paymentMethod);
        if (strategy == null){
            return ServerResponse.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Unsupported payment Method" + request.getPaymentMethod(),false));
        }

        // Save Address
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        Address savedAddress = addressRepository.save(address);

        //calculate Total Cost
        double totalCost = cartItems.stream().mapToDouble(item-> item.getProduct().getPrice() * item.getQuantity()).sum();

        // Build base order
        Order order =  new Order(); // creating new order
        order.setUser(user);
        order.setAddress(savedAddress);
        order.setCreatedAt(LocalDateTime.now());
        order.setTotal(totalCost);
        order.setPaymentMethod(paymentMethod);

        // Convert cart item to order Items
        for(CartItem cartItem: cartItems){
            OrderItem orderItem = new OrderItem(order,cartItem.getProduct(), cartItem.getQuantity(),
        cartItem.getProduct().getPrice());
            order.addItem(orderItem);
        }

        // hand off to specific strategy for processing
        return strategy.processPayment(order,request);
    }

    @Override
    @Transactional
    public ServerResponse verifyPayment(Long orderId, PaymentVerificationRequest request) throws Exception {
        Order order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order is not found"));

        String method = order.getPaymentMethod().toUpperCase();

        PaymentStrategy strategy = paymentStrategies.get(method);
        if(strategy == null){
            return ServerResponse.status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse("Unsupported Payment Method: " + order.getPaymentMethod(), false));
        }

        // delegate verification to strategy
        return strategy.verifyPayment(order, request);
    }

}
