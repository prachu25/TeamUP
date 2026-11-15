package com.teamup.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.service.HackathonParticipantService;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonParticipantController {

    private HackathonParticipantService hackPartServ;

    public HackathonParticipantController(HackathonParticipantService participantService) {
        this.hackPartServ = participantService;
    }

    @PostMapping("{hackathonId}/participate")
    public String participate(@PathVariable Long hackathonId, @RequestParam Long userId) {
        return hackPartServ.participate(userId, hackathonId);
    }

    @DeleteMapping("/participants/cancle")
    public ResponseEntity<Map<String, String>> cancleParticipation(
            @RequestParam Long userId,
            @RequestParam Long hackathonId) {
        String message = hackPartServ.cancleParticipation(userId, hackathonId);

        return ResponseEntity.ok(Map.of("message", message));
    }

}
