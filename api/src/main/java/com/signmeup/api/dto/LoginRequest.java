package com.signmeup.api.dto;

public record LoginRequest(
        String usernameOrEmail,
        String password
) {
}
