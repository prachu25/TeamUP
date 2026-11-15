package com.teamup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.entity.Hackathon;
import com.teamup.service.HackathonService;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {

    private HackathonService hackServ;

    public HackathonController(HackathonService hackthonService) {
        this.hackServ = hackthonService;
    }

    @GetMapping
    public ResponseEntity<List<Hackathon>> getAllHackathons() {
        return ResponseEntity.ok(hackServ.getAllHackathons());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hackathon>> searchHackathons(@RequestParam String name) {
        return ResponseEntity.ok(hackServ.searchHackthonsByName(name));
    }

}
