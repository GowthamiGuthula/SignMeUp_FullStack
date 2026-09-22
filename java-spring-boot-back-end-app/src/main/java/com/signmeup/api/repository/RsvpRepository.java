package com.signmeup.api.repository;

import com.signmeup.api.entity.Rsvp;
import com.signmeup.api.entity.RsvpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {

    Optional<Rsvp> findById(Long id);

    List<Rsvp> findByEventId(Long eventId);

    List<Rsvp> findByEventIdAndStatus(Long eventId, RsvpStatus status);

    @Query("SELECT r FROM Rsvp r WHERE r.event.id = :eventId AND r.status = 'ATTENDING'")
    List<Rsvp> findAttendeesByEventId(@Param("eventId") Long eventId);

    Optional<Rsvp> findByEventIdAndEmail(Long eventId, String email);

    List<Rsvp> findByEmail(String email);

    List<Rsvp> findByEmailOrderByCreatedAtDesc(String email);

    @Query("SELECT COUNT(r) FROM Rsvp r WHERE r.event.id = :eventId AND r.status = 'ATTENDING'")
    Long countAttendingByEventId(@Param("eventId") Long eventId);

    boolean existsByEventIdAndEmail(Long eventId, String email);

    List<Rsvp> findByUserId(Long userId);

    List<Rsvp> findByUserIdOrderByCreatedAtDesc(Long userId);
}
