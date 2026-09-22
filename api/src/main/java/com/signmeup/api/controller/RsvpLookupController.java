package com.signmeup.api.controller;

import com.signmeup.api.dto.RsvpResponse;
import com.signmeup.api.service.RsvpService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rsvps")
public class RsvpLookupController {

    private final RsvpService rsvpService;

    public RsvpLookupController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @GetMapping
    public List<RsvpResponse> getRsvpsByEmail(@RequestParam String email) {
        return rsvpService.getRsvpsByEmail(email);
    }
}
