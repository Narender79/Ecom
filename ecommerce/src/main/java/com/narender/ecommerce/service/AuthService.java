package com.narender.ecommerce.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.LoginRequest;
import com.narender.ecommerce.dto.RegisterRequest;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public ApiResponse register(RegisterRequest request){
        // validate by email
        if(userRepository.existsByEmail(request.getEmail())){
            return new ApiResponse("Email already exists", false);
        }

        // validate by password and confirm password
        if(!request.getPassword().equals(request.getConfirmPassword())){
            return new ApiResponse("Passwords do not match", false);
        }

        // validate by length of passwords
        if(request.getPassword().length()<6){
            return new ApiResponse("Password length should be of lenght 6", false);
        }

        //creating new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);


        return new ApiResponse("User registered successfully", true);
    }

    public ApiResponse login(LoginRequest request){
        var user = userRepository.findByEmail(request.getEmail());
        if(user.isEmpty()){
            return new ApiResponse("User is not found", false);
        }

        User foundUser = user.get();
        if(!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())){
            return new ApiResponse("Invalid password",false);
        }

        return new ApiResponse("User successfully logged in", true);
    }
}
