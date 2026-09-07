package com.signmeup.api.repository;

import com.signmeup.api.entity.EventInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventInvitationRepository extends JpaRepository<EventInvitation, Long> {

    Optional<EventInvitation> findById(Long id);

    List<EventInvitation> findByEventId(Long eventId);

    List<EventInvitation> findByEmail(String email);

    Optional<EventInvitation> findByEventIdAndEmail(Long eventId, String email);

    boolean existsByEventIdAndEmail(Long eventId, String email);

    void deleteByEventIdAndEmail(Long eventId, String email);

    void deleteByEventId(Long eventId);
}
