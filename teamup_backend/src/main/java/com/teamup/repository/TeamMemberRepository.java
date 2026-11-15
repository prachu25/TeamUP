package com.teamup.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamup.entity.TeamMember;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    boolean existsByUserIdAndHackathonId(Long userId, Long hackathonId);

    int countByTeamId(Long teamId);

    Optional<TeamMember> findByUserIdAndHackathonId(Long userId, Long HackathonId);

    List<TeamMember> findByTeamId(Long teamId);

}