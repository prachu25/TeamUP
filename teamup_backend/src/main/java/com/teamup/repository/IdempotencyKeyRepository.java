package com.teamup.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamup.entity.IdempotencyKey;

public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKey, Long> {

    Optional<IdempotencyKey> findByUserIdAndIdempotencyKey(Long userId, String key);

}
