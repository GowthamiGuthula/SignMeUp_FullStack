package com.signmeup.api.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String displayName,
        LocalDateTime createdAt
) {
}
