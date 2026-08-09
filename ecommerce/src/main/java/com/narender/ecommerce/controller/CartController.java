package com.narender.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.CartItemRequest;
import com.narender.ecommerce.repository.CartItemRepository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.model.CartItem;
import com.narender.ecommerce.repository.UserRepository;
import com.narender.ecommerce.repository.ProductRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ServerResponse getCart(ServerRequest request) throws Exception {
        User user = getAuthenticatedUser();
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        // Flatten the CartItem objects into a structure the React frontend can consume
        // directly
        List<Map<String, Object>> response = items.stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            Product p = item.getProduct();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("category", p.getCategory());
            map.put("price", p.getPrice());
            map.put("imageUrl", p.getImageUrl());
            map.put("isAvailable", p.isAvailable());
            map.put("quantity", item.getQuantity());
            return map;
        }).toList();
        return ServerResponse.ok().body(new ApiResponse("Cart retrieved", true, response));
    }

    @PostMapping
    public ServerResponse addToCart(ServerRequest request) throws Exception {
        User user = getAuthenticatedUser();
        CartItemRequest body = request.body(CartItemRequest.class);

        Product product = productRepository.findById(body.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        var optItem = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        CartItem cartItem;

        if (optItem.isPresent()) {
            cartItem = optItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + body.getQuantity());
        } else {
            cartItem = new CartItem(user, product, body.getQuantity());
        }
        cartItemRepository.save(cartItem);

        return ServerResponse.ok().body(new ApiResponse("Item added to cart", true));
    }

    @PutMapping("/{id}")
    public ServerResponse updateCart(ServerRequest request) throws Exception {
        User user = getAuthenticatedUser();
        Long productId = Long.parseLong(request.pathVariable("id"));
        CartItemRequest body = request.body(CartItemRequest.class);

        var optItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);

        if (optItem.isEmpty()) {
            return ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Item not found in cart", false));
        }

        CartItem cartItem = optItem.get();
        if (body.getQuantity() <= 0) {
            cartItemRepository.delete(cartItem);
            return ServerResponse.ok().body(new ApiResponse("Item removed from cart", true));
        } else {
            cartItem.setQuantity(body.getQuantity());
            cartItemRepository.save(cartItem);
            return ServerResponse.ok().body(new ApiResponse("Cart updated", true));
        }
    }

    @DeleteMapping("/{id}")
    public ServerResponse removeFromCart(ServerRequest request) {
        User user = getAuthenticatedUser();
        Long productId = Long.parseLong(request.pathVariable("id"));

        var optItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);

        if (optItem.isPresent()) {
            cartItemRepository.delete(optItem.get());
            return ServerResponse.ok().body(new ApiResponse("Item removed from cart", true));
        }

        return ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .body(new ApiResponse("Item not found in cart", false));
    }

}
