package com.signmeup.api.repository;

import com.signmeup.api.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findById(Long id);

    List<Event> findByOrganizerEmail(String organizerEmail);

    List<Event> findByOrganizerEmailOrderByDateAsc(String organizerEmail);

    @Query("""
        SELECT e FROM Event e
        WHERE e.visibility = 'PUBLIC'
           OR e.organizerEmail = :email
           OR EXISTS (SELECT 1 FROM EventInvitation i
                      WHERE i.event = e AND i.email = :email)
           OR :isAdmin = TRUE
        ORDER BY e.date ASC
        """)
    List<Event> findVisibleEvents(@Param("email") String email,
                                 @Param("isAdmin") boolean isAdmin);

    @Query("""
        SELECT e FROM Event e
        WHERE (:isAdmin = TRUE
               OR e.visibility = 'PUBLIC'
               OR e.organizerEmail = :email
               OR EXISTS (SELECT 1 FROM EventInvitation i
                          WHERE i.event = e AND i.email = :email))
          AND (:search IS NULL
               OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.location) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY e.date ASC
        """)
    List<Event> findVisibleEventsBySearch(@Param("email") String email,
                                         @Param("isAdmin") boolean isAdmin,
                                         @Param("search") String search);
}
