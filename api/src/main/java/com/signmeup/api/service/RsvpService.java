package com.signmeup.api.service;

import com.signmeup.api.dto.RsvpRequest;
import com.signmeup.api.dto.RsvpResponse;
import com.signmeup.api.entity.Event;
import com.signmeup.api.entity.Rsvp;
import com.signmeup.api.entity.RsvpStatus;
import com.signmeup.api.exception.DuplicateRsvpException;
import com.signmeup.api.exception.EventFullException;
import com.signmeup.api.exception.ResourceNotFoundException;
import com.signmeup.api.repository.RsvpRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final EventService eventService;

    public RsvpService(RsvpRepository rsvpRepository, EventService eventService) {
        this.rsvpRepository = rsvpRepository;
        this.eventService = eventService;
    }

    public RsvpResponse rsvpToEvent(Long eventId, RsvpRequest request) {
        Event event = eventService.findEventOrThrow(eventId);

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (rsvpRepository.existsByEventIdAndEmail(eventId, request.email())) {
            throw new DuplicateRsvpException("This email has already RSVP'd to this event");
        }

        RsvpStatus status = request.status() != null ? request.status() : RsvpStatus.ATTENDING;
        if (status == RsvpStatus.ATTENDING) {
            long attending = rsvpRepository.countAttendingByEventId(eventId);
            if (attending >= event.getTotalSlots()) {
                throw new EventFullException("This event is fully booked");
            }
        }

        Rsvp rsvp = new Rsvp(event, request.firstName(), request.lastName(),
                request.email(), request.phone(), status);

        return toResponse(rsvpRepository.save(rsvp));
    }

    public void cancelRsvp(Long eventId, String email) {
        Rsvp rsvp = rsvpRepository.findByEventIdAndEmail(eventId, email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No RSVP found for " + email + " on event " + eventId));
        rsvpRepository.delete(rsvp);
    }

    public RsvpResponse updateRsvp(Long eventId, String email, RsvpRequest request) {
        Rsvp rsvp = rsvpRepository.findByEventIdAndEmail(eventId, email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No RSVP found for " + email + " on event " + eventId));

        RsvpStatus newStatus = request.status() != null ? request.status() : rsvp.getStatus();
        if (newStatus == RsvpStatus.ATTENDING && rsvp.getStatus() != RsvpStatus.ATTENDING) {
            Event event = eventService.findEventOrThrow(eventId);
            long attending = rsvpRepository.countAttendingByEventId(eventId);
            if (attending >= event.getTotalSlots()) {
                throw new EventFullException("This event is fully booked");
            }
        }

        if (request.firstName() != null) rsvp.setFirstName(request.firstName());
        if (request.lastName() != null) rsvp.setLastName(request.lastName());
        if (request.phone() != null) rsvp.setPhone(request.phone());
        rsvp.setStatus(newStatus);

        return toResponse(rsvpRepository.save(rsvp));
    }

    public List<RsvpResponse> getAttendees(Long eventId) {
        eventService.findEventOrThrow(eventId);
        return rsvpRepository.findByEventId(eventId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RsvpResponse> getRsvpsByEmail(String email) {
        return rsvpRepository.findByEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toResponse)
                .toList();
    }

    private RsvpResponse toResponse(Rsvp rsvp) {
        return new RsvpResponse(
                rsvp.getId(),
                rsvp.getEvent().getId(),
                rsvp.getFirstName(),
                rsvp.getLastName(),
                rsvp.getEmail(),
                rsvp.getPhone(),
                rsvp.getStatus(),
                rsvp.getCreatedAt()
        );
    }
}
