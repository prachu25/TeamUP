package com.teamup.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamup.entity.HackathonParticipant;

@Repository
public interface HackathonParticipantRepository extends JpaRepository<HackathonParticipant, Long> {

    boolean existsByUserUserIdAndHackathonHackathonId(
            Long userId, Long hackathonId);

    void deleteByUserUserIdAndHackathonHackathonId(Long UserId, Long hackthonId);

}
