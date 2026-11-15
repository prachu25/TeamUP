package com.teamup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.teamup.entity.JoinRequest;

import jakarta.persistence.LockModeType;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {

    boolean existsByTeamIdAndUserIdAndStatus(
            Long teamId, Long userId, String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT j from JoinRequest j WHERE j.requestId = :requestId")
    Optional<JoinRequest> findByIdWithLock(@Param("requestId") Long requestId);

    List<JoinRequest> findByTeamIdAndStatus(Long teamId, String status);
}