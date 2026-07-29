package com.narender.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Handler methods for functional routing
    public ServerResponse getMeHandler(ServerRequest request) throws Exception {
        try{
            User user = getAuthenticatedUser();
            Map<String,Object> userData = new HashMap<>();
            userData.put("id",user.getId());
            userData.put("email",user.getEmail());
            userData.put("fullName", user.getName());
            return ServerResponse.ok().body(new ApiResponse("User retrieved", true,userData));
        }catch(Exception e){
            return ServerResponse.badRequest().body(new ApiResponse("Failed to retrieve user: "+ e.getMessage(), false)) ;
        }
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