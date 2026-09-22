package com.signmeup.api.dto;

public record ForgotPasswordRequest(
        String email,
        String newPassword
) {
}
