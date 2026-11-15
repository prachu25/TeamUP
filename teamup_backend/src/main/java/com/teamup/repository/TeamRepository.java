package com.teamup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.teamup.entity.Team;

import jakarta.persistence.LockModeType;

public interface TeamRepository extends JpaRepository<Team, Long> {

    // Last seat logic lock
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t from Team t WHERE t.teamId = :teamId")
    Optional<Team> findByIdWithLock(@Param("teamId") Long teamId);

    boolean existsByLeaderId(Long leaderId);

    List<Team> findByLeaderId(Long leaderId);
}
