package com.signmeup.api.service;

import com.signmeup.api.dto.ForgotPasswordRequest;
import com.signmeup.api.dto.LoginRequest;
import com.signmeup.api.dto.RegisterRequest;
import com.signmeup.api.dto.UpdateProfileRequest;
import com.signmeup.api.dto.UserResponse;
import com.signmeup.api.entity.User;
import com.signmeup.api.exception.DuplicateUserException;
import com.signmeup.api.exception.InvalidCredentialsException;
import com.signmeup.api.exception.ResourceNotFoundException;
import com.signmeup.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateUserException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateUserException("Email is already registered");
        }

        User user = new User(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.displayName() != null && !request.displayName().isBlank()
                        ? request.displayName()
                        : request.username()
        );

        return toResponse(userRepository.save(user));
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.usernameOrEmail())
                .or(() -> userRepository.findByEmail(request.usernameOrEmail()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid username/email or password");
        }

        return toResponse(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (request.newPassword() == null || request.newPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("No account found with that email"));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    public UserResponse getUserById(Long id) {
        return toResponse(findUserOrThrow(id));
    }

    public UserResponse updateProfile(Long id, UpdateProfileRequest request) {
        User user = findUserOrThrow(id);
        if (request.displayName() != null && !request.displayName().isBlank()) {
            user.setDisplayName(request.displayName());
        }
        return toResponse(userRepository.save(user));
    }

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getCreatedAt()
        );
    }
}
