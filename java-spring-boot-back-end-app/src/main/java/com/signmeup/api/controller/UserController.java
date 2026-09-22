package com.signmeup.api.controller;

import com.signmeup.api.dto.ForgotPasswordRequest;
import com.signmeup.api.dto.LoginRequest;
import com.signmeup.api.dto.RegisterRequest;
import com.signmeup.api.dto.UpdateProfileRequest;
import com.signmeup.api.dto.UserResponse;
import com.signmeup.api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse created = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/auth/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/users/{id}")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(id, request);
    }
}
