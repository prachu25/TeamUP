package com.teamup.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.teamup.entity.Hackathon;
import com.teamup.exception.HackathonNotFoundException;
import com.teamup.repository.HackathonRepository;

@Service
public class HackathonService {

    private HackathonRepository hackRepo;

    public HackathonService(HackathonRepository hackathonRepository) {
        this.hackRepo = hackathonRepository;
    }

    // 1. Get all Hackathons
    public List<Hackathon> getAllHackathons() {
        return hackRepo.findAll();
    }

    // 2. find the hackthon name
    public List<Hackathon> searchHackthonsByName(String name) {

        List<Hackathon> hackathons = hackRepo.findByNameContainingIgnoreCase(name);

        if (hackathons.isEmpty()) {
            throw new HackathonNotFoundException("No hackathons found with name: " + name);
        }

        return hackathons;
    }

}
