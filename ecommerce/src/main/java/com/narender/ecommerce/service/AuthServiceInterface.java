package com.narender.ecommerce.service;


import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.LoginRequest;
import com.narender.ecommerce.dto.RegisterRequest;

public interface AuthServiceInterface {
    ApiResponse register (RegisterRequest request);
    ApiResponse login(LoginRequest request);
}
