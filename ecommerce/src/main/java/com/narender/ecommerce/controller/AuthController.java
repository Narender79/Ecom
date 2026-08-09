package com.narender.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.LoginRequest;
import com.narender.ecommerce.dto.RegisterRequest;
import com.narender.ecommerce.service.AuthService;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
    @Autowired
    private AuthService authService;

    // Handler methods for functional routing
    public ServerResponse register(ServerRequest request) throws Exception {
        RegisterRequest body = request.body(RegisterRequest.class);
        ApiResponse response = authService.register(body);

        return ServerResponse.ok().body(response);
    }

    public ServerResponse login(ServerRequest request) throws Exception {
        LoginRequest body = request.body(LoginRequest.class);
        ApiResponse response = authService.login(body);

        return ServerResponse.ok().body(response);
    }
}
