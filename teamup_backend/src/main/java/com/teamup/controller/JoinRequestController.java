package com.teamup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.entity.JoinRequest;
import com.teamup.service.JoinRequestService;

@RestController
@RequestMapping("/api/join-requests")
public class JoinRequestController {

    private JoinRequestService joinReqServ;

    public JoinRequestController(JoinRequestService joinRequestService) {
        this.joinReqServ = joinRequestService;
    }

    @PostMapping("/send")
    public JoinRequest sendJoinRequest(
            @RequestParam Long teamId,
            @RequestParam Long userId) {

        return joinReqServ.sendJoinRequest(teamId, userId);
    }

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<String> acceptJoinRequest(
            @PathVariable Long requestId,
            @RequestParam Long leaderId) {

        joinReqServ.acceptJoinRequest(requestId, leaderId);

        return ResponseEntity.ok("Join request accepted successfully");
    }

    @PutMapping("/reject/{requestId}")
    public ResponseEntity<String> rejectJoinRequest(
            @PathVariable Long requestId,
            @RequestParam Long leaderId) {

        joinReqServ.rejectJoinRequest(requestId, leaderId);

        return ResponseEntity.ok("Join request Rejected!!");
    }

    @GetMapping("/pending/{teamId}")
    public ResponseEntity<Object> getPendingRequests(
            @PathVariable Long teamId,
            @RequestParam Long leaderId) {

        return ResponseEntity.ok(joinReqServ.getPendingRequests(teamId, leaderId));
    }

}
