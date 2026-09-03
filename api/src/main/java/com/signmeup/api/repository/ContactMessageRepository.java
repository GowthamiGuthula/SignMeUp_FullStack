package com.signmeup.api.repository;

import com.signmeup.api.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    Optional<ContactMessage> findById(Long id);

    List<ContactMessage> findAll();

    List<ContactMessage> findByHandled(Boolean handled);

    List<ContactMessage> findByHandledOrderBySubmittedAtDesc(Boolean handled);
}
