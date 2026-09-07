package com.signmeup.api.dto;

import com.signmeup.api.entity.EventCategory;
import com.signmeup.api.entity.EventVisibility;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String name,
        String date,
        String time,
        String location,
        EventCategory category,
        Integer totalSlots,
        Integer slotsBooked,
        String description,
        String imageUrl,
        EventVisibility visibility,
        String organizerEmail,
        LocalDateTime createdAt
) {
}
