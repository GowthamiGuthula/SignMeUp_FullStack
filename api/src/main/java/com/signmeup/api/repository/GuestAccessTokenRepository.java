package com.signmeup.api.repository;

import com.signmeup.api.entity.GuestAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestAccessTokenRepository extends JpaRepository<GuestAccessToken, Long> {

    Optional<GuestAccessToken> findByEmail(String email);

    Optional<GuestAccessToken> findByToken(String token);

    boolean existsByEmail(String email);

    boolean existsByToken(String token);
}
