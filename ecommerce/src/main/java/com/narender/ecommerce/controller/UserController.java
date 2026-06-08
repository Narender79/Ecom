package com.narender.ecommerce.controller;

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
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> getMe(){
        return ResponseEntity.ok(new ApiResponse("User retrieved", true));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(new ApiResponse("User retrieved", true));
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Object settings) {
        return ResponseEntity.ok(new ApiResponse("User settings updated", true));
    }

    // Handler methods for functional routing
    public ServerResponse getMeHandler(ServerRequest request) throws Exception {
        return ServerResponse.ok().body(new ApiResponse("User retrieved", true));
    }

    public ServerResponse getUserByIdHandler(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return ServerResponse.ok().body(new ApiResponse("User retrieved", true));
    }

    public ServerResponse updateSettingsHandler(ServerRequest request) throws Exception {
        Object body = request.body(Object.class);
        return ServerResponse.ok().body(new ApiResponse("User settings updated", true));
    }
}
