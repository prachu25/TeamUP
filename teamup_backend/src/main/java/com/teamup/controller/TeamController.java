package com.teamup.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.dto.CreateTeamRequest;
import com.teamup.dto.CreateTeamResponse;
import com.teamup.dto.TeamResponseDTO;
import com.teamup.service.TeamService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private TeamService teamServ;

    public TeamController(TeamService teamService) {
        this.teamServ = teamService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateTeamResponse> createTeam(
            @Valid @RequestBody CreateTeamRequest request,
            @RequestHeader("Idempotency-key") String key,
            @RequestParam Long userId) {

        CreateTeamResponse response = teamServ.createTeam(request, userId, key);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TeamResponseDTO>> getAllTeams() {
        return ResponseEntity.ok(teamServ.getAllTeams());
    }

    @GetMapping("/check-leader/{userId}")
    public ResponseEntity<?> checkLeader(@PathVariable Long userId) {

        boolean isLeader = teamServ.checkLeader(userId);

        return ResponseEntity.ok(
                java.util.Map.of("isLeader", isLeader));
    }

    @GetMapping("/my-teams/{userId}")
    public ResponseEntity<List<TeamResponseDTO>> getMyTeams(
            @PathVariable Long userId) {

        return ResponseEntity.ok(teamServ.getMyTeams(userId));
    }

}
