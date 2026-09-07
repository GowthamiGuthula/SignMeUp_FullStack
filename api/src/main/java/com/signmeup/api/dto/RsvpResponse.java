package com.signmeup.api.dto;

import com.signmeup.api.entity.RsvpStatus;

import java.time.LocalDateTime;

public record RsvpResponse(
        Long id,
        Long eventId,
        String firstName,
        String lastName,
        String email,
        String phone,
        RsvpStatus status,
        LocalDateTime createdAt
) {
}
