package com.signmeup.api.exception;

public class DuplicateRsvpException extends RuntimeException {
    public DuplicateRsvpException(String message) {
        super(message);
    }
}
