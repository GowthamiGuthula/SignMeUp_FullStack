package com.signmeup.api.service;

import com.signmeup.api.dto.EventRequest;
import com.signmeup.api.dto.EventResponse;
import com.signmeup.api.entity.Event;
import com.signmeup.api.entity.EventVisibility;
import com.signmeup.api.exception.ForbiddenException;
import com.signmeup.api.exception.ResourceNotFoundException;
import com.signmeup.api.repository.EventRepository;
import com.signmeup.api.repository.RsvpRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RsvpRepository rsvpRepository;

    public EventService(EventRepository eventRepository, RsvpRepository rsvpRepository) {
        this.eventRepository = eventRepository;
        this.rsvpRepository = rsvpRepository;
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll(Sort.by("date")).stream()
                .map(this::toResponse)
                .toList();
    }

    public EventResponse getEventById(Long id) {
        return toResponse(findEventOrThrow(id));
    }

    public EventResponse createEvent(EventRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Event name is required");
        }
        if (request.totalSlots() == null || request.totalSlots() < 1) {
            throw new IllegalArgumentException("Total slots must be at least 1");
        }

        Event event = new Event(
                request.name(),
                request.date(),
                request.time(),
                request.location(),
                request.category(),
                request.totalSlots(),
                request.description(),
                request.imageUrl(),
                request.visibility() != null ? request.visibility() : EventVisibility.PUBLIC,
                request.organizerEmail()
        );

        return toResponse(eventRepository.save(event));
    }

    public EventResponse updateEvent(Long id, EventRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Event name is required");
        }
        if (request.totalSlots() == null || request.totalSlots() < 1) {
            throw new IllegalArgumentException("Total slots must be at least 1");
        }

        Event event = findEventOrThrow(id);
        event.setName(request.name());
        event.setDate(request.date());
        event.setTime(request.time());
        event.setLocation(request.location());
        event.setCategory(request.category());
        event.setTotalSlots(request.totalSlots());
        event.setDescription(request.description());
        event.setImageUrl(request.imageUrl());
        event.setVisibility(request.visibility() != null ? request.visibility() : event.getVisibility());
        event.setOrganizerEmail(request.organizerEmail());

        return toResponse(eventRepository.save(event));
    }

    public void deleteEvent(Long id, String requesterEmail) {
        Event event = findEventOrThrow(id);

        if (requesterEmail == null || requesterEmail.isBlank()) {
            throw new ForbiddenException("You must be signed in as the organizer to delete this event");
        }
        if (!event.getOrganizerEmail().equalsIgnoreCase(requesterEmail.trim())) {
            throw new ForbiddenException("Only the event organizer can delete this event");
        }

        eventRepository.delete(event);
    }

    Event findEventOrThrow(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
    }

    private EventResponse toResponse(Event event) {
        int slotsBooked = rsvpRepository.countAttendingByEventId(event.getId()).intValue();
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDate(),
                event.getTime(),
                event.getLocation(),
                event.getCategory(),
                event.getTotalSlots(),
                slotsBooked,
                event.getDescription(),
                event.getImageUrl(),
                event.getVisibility(),
                event.getOrganizerEmail(),
                event.getCreatedAt()
        );
    }
}
