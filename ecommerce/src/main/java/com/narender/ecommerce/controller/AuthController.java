package com.narender.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/auth")

public class AuthController {
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Object userRequest){
        return ResponseEntity.ok(new ApiResponse("User register successfully",true));
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object loginRequest) {
        return ResponseEntity.ok(new ApiResponse("User logged in successfully", true));
    }
}
