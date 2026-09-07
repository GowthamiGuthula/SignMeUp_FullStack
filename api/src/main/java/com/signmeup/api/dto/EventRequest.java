package com.signmeup.api.dto;

import com.signmeup.api.entity.EventCategory;
import com.signmeup.api.entity.EventVisibility;

public record EventRequest(
        String name,
        String date,
        String time,
        String location,
        EventCategory category,
        Integer totalSlots,
        String description,
        String imageUrl,
        EventVisibility visibility,
        String organizerEmail
) {
}
