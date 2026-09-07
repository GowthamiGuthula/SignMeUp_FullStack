package com.signmeup.api.controller;

import com.signmeup.api.dto.RsvpRequest;
import com.signmeup.api.dto.RsvpResponse;
import com.signmeup.api.service.RsvpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/rsvps")
public class RsvpController {

    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @GetMapping
    public List<RsvpResponse> getAttendees(@PathVariable Long eventId) {
        return rsvpService.getAttendees(eventId);
    }

    @PostMapping
    public ResponseEntity<RsvpResponse> rsvp(@PathVariable Long eventId, @RequestBody RsvpRequest request) {
        RsvpResponse response = rsvpService.rsvpToEvent(eventId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> cancelRsvp(@PathVariable Long eventId, @RequestParam String email) {
        rsvpService.cancelRsvp(eventId, email);
        return ResponseEntity.noContent().build();
    }
}
