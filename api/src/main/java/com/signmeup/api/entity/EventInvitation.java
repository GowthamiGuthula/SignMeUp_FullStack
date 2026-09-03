package com.signmeup.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_invitations", uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "email"}),
       indexes = @Index(name = "idx_email", columnList = "email"))
public class EventInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(name = "invited_at", nullable = false, updatable = false)
    private LocalDateTime invitedAt;

    @PrePersist
    protected void onCreate() {
        invitedAt = LocalDateTime.now();
    }

    public EventInvitation() {
    }

    public EventInvitation(Event event, String email) {
        this.event = event;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getInvitedAt() {
        return invitedAt;
    }

    public void setInvitedAt(LocalDateTime invitedAt) {
        this.invitedAt = invitedAt;
    }

    @Override
    public String toString() {
        return "EventInvitation{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", invitedAt=" + invitedAt +
                '}';
    }
}
