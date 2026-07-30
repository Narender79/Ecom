package com.narender.ecommerce.security;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import com.narender.ecommerce.model.User;
import com.narender.ecommerce.repository.UserRepository;

@Component
public class CurrentUserProvider {
    private final UserRepository users;
    public CurrentUserProvider(UserRepository users){
        this.users = users;
    }

    public User get(){
        return users.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).orElseThrow(()-> new RuntimeException("User not found"));
    }

}
