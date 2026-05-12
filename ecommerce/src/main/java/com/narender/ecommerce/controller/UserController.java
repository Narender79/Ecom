package com.narender.ecommerce.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        return ResponseEntity.ok(new ApiResponse("user retrieved",true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(new ApiResponse("user retrieved",true));
    }
    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Object settings) {
        return ResponseEntity.ok(new ApiResponse("User settings updated", true));
    }
}
