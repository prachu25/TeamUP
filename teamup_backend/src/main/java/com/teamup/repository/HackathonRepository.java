package com.teamup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamup.entity.Hackathon;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {

    List<Hackathon> findByNameContainingIgnoreCase(String name);

}
