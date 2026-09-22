package com.signmeup.api.dto;

import com.signmeup.api.entity.RsvpStatus;

public record RsvpRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        RsvpStatus status
) {
}
