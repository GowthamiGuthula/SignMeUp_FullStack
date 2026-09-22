package com.signmeup.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "event_date", nullable = false)
    private String date;

    @Column(name = "time_range", length = 60)
    private String time;

    @Column(length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    private EventCategory category;

    @Min(1)
    @Column(nullable = false)
    private Integer totalSlots;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'PUBLIC'")
    private EventVisibility visibility = EventVisibility.PUBLIC;

    @Column(nullable = false, length = 160)
    private String organizerEmail;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "organizer_user_id")
    private User organizer;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.LAZY)
    private Set<Rsvp> rsvps = new HashSet<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true, fetch = jakarta.persistence.FetchType.LAZY)
    private Set<EventInvitation> invitations = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Event() {
    }

    public Event(String name, String date, String time, String location, EventCategory category,
                 Integer totalSlots, String description, String imageUrl, EventVisibility visibility,
                 String organizerEmail) {
        this.name = name;
        this.date = date;
        this.time = time;
        this.location = location;
        this.category = category;
        this.totalSlots = totalSlots;
        this.description = description;
        this.imageUrl = imageUrl;
        this.visibility = visibility;
        this.organizerEmail = organizerEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public EventCategory getCategory() {
        return category;
    }

    public void setCategory(EventCategory category) {
        this.category = category;
    }

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public EventVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(EventVisibility visibility) {
        this.visibility = visibility;
    }

    public String getOrganizerEmail() {
        return organizerEmail;
    }

    public void setOrganizerEmail(String organizerEmail) {
        this.organizerEmail = organizerEmail;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Rsvp> getRsvps() {
        return rsvps;
    }

    public void setRsvps(Set<Rsvp> rsvps) {
        this.rsvps = rsvps;
    }

    public Set<EventInvitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(Set<EventInvitation> invitations) {
        this.invitations = invitations;
    }

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date='" + date + '\'' +
                ", location='" + location + '\'' +
                ", category=" + category +
                ", visibility=" + visibility +
                ", organizerEmail='" + organizerEmail + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
