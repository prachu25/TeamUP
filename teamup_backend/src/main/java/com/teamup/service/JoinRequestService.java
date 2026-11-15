package com.teamup.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamup.entity.JoinRequest;
import com.teamup.entity.Team;
import com.teamup.entity.TeamMember;
import com.teamup.entity.User;
import com.teamup.repository.HackathonParticipantRepository;
import com.teamup.repository.JoinRequestRepository;
import com.teamup.repository.TeamMemberRepository;
import com.teamup.repository.TeamRepository;
import com.teamup.repository.UserRepository;

@Service
public class JoinRequestService {

    private JoinRequestRepository joinReqRepo;
    private TeamRepository teamRepo;
    private TeamMemberRepository teamMem_repo;
    private HackathonParticipantRepository hackPartRepo;
    private UserRepository userRepo;

    public JoinRequestService(
            JoinRequestRepository joinRequestRepository,
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            HackathonParticipantRepository hackathonParticipantRepository,
            UserRepository usRepository) {

        this.joinReqRepo = joinRequestRepository;
        this.teamRepo = teamRepository;
        this.teamMem_repo = teamMemberRepository;
        this.hackPartRepo = hackathonParticipantRepository;
        this.userRepo = usRepository;
    }

    // 1. send request
    public JoinRequest sendJoinRequest(Long teamId, Long userId) {

        // a. check team exists
        Team team = teamRepo.findById(teamId).orElseThrow(() -> new IllegalArgumentException("Team not Found!"));

        // b. check hackathon participation
        boolean participant = hackPartRepo.existsByUserUserIdAndHackathonHackathonId(userId, team.getHackathonId());

        if (!participant) {
            throw new IllegalArgumentException("Not Register for this hackathon");
        }

        // c. check user is not already in team
        if (teamMem_repo.existsByUserIdAndHackathonId(userId, team.getHackathonId())) {
            throw new IllegalArgumentException("You already belong to a team");
        }

        // e. check duplicate pending request
        if (joinReqRepo.existsByTeamIdAndUserIdAndStatus(teamId, userId, "PENDING")) {
            throw new IllegalArgumentException("Join request already sent");
        }

        // f. check team capacity
        int currentMembers = teamMem_repo.countByTeamId(teamId);

        if (currentMembers >= team.getMaxMembers()) {
            throw new IllegalArgumentException("Team is already full");
        }

        // g. Create join request
        JoinRequest request = new JoinRequest();

        request.setTeamId(teamId);
        request.setUserId(userId);
        request.setStatus("PENDING");

        return joinReqRepo.save(request);

    }

    // 2. ACCEPT REQUEST
    @Transactional
    public void acceptJoinRequest(Long requestId, Long leaderId) {

        // 1. Find and lock join request
        JoinRequest request = joinReqRepo.findByIdWithLock(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Join request not found"));

        // 2. Check request status
        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("Request is already processed");
        }

        // 3. Find and lock team
        Team team = teamRepo.findByIdWithLock(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        // Check team leader
        if (!team.getLeaderId().equals(leaderId)) {
            throw new IllegalArgumentException("Only team leader can accept requests");
        }

        // 4. Check whether user already belongs to a team
        if (teamMem_repo.existsByUserIdAndHackathonId(
                request.getUserId(), team.getHackathonId())) {
            throw new IllegalArgumentException("User already belongs to a team!");
        }

        // 5. Check team capacity
        int memberCount = teamMem_repo.countByTeamId(team.getTeamId());

        if (memberCount >= team.getMaxMembers()) {

            // Find all remaining pending requests
            List<JoinRequest> pendingRequests = joinReqRepo.findByTeamIdAndStatus(
                    team.getTeamId(), "PENDING");

            // Automatically reject them
            for (JoinRequest pending : pendingRequests) {
                pending.setStatus("REJECTED");
                pending.setRespondedAt(LocalDateTime.now());
            }

            joinReqRepo.saveAll(pendingRequests);

            return;
        }

        // 6. Add user to team
        TeamMember member = new TeamMember();

        member.setTeamId(team.getTeamId());
        member.setHackathonId(team.getHackathonId());
        member.setUserId(request.getUserId());

        teamMem_repo.save(member);

        // 7. Update request status
        request.setStatus("ACCEPTED");
        request.setRespondedAt(LocalDateTime.now());

        joinReqRepo.save(request);

        // 8. Check whether team is full after acceptance
        int currentMembers = teamMem_repo.countByTeamId(team.getTeamId());

        if (currentMembers >= team.getMaxMembers()) {

            // Find remaining pending requests
            List<JoinRequest> pendingRequests = joinReqRepo.findByTeamIdAndStatus(
                    team.getTeamId(), "PENDING");

            // Automatically reject them
            for (JoinRequest pending : pendingRequests) {
                pending.setStatus("REJECTED");
                pending.setRespondedAt(LocalDateTime.now());
            }

            joinReqRepo.saveAll(pendingRequests);
        }
    }

    // 3. REJECTED REQUEST
    @Transactional
    public void rejectJoinRequest(Long requestId, Long leaderId) {

        // 1. find and lock request
        JoinRequest req = joinReqRepo.findByIdWithLock(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Join request not found"));

        // 2. check request status
        if (!"PENDING".equals(req.getStatus())) {
            throw new IllegalArgumentException("Request is already peocessed");
        }

        // 3. find team
        Team team = teamRepo.findByIdWithLock(req.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        // 4. check team leader
        if (!team.getLeaderId().equals(leaderId)) {
            throw new IllegalArgumentException("Only team leader can reject requests");
        }

        // 5. Update Request status
        req.setStatus("REJECTED");
        req.setRespondedAt(LocalDateTime.now());

        joinReqRepo.save(req);
    }

    // GET PENDING REQUESTS BY LEADER
    public Object getPendingRequests(Long teamId, Long leaderId) {

        // 1. Find team
        Team team = teamRepo.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team Not Found"));

        // 2. Check team leader
        if (!team.getLeaderId().equals(leaderId)) {
            throw new IllegalArgumentException(
                    "Only team leader can view the requests");
        }

        // 3. Get pending requests
        List<JoinRequest> requests = joinReqRepo.findByTeamIdAndStatus(teamId, "PENDING");

        // 4. Prepare response
        List<Map<String, Object>> response = new ArrayList<>();

        for (JoinRequest request : requests) {

            User user = userRepo.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Map<String, Object> data = new java.util.HashMap<>();

            data.put("requestId", request.getRequestId());
            data.put("userId", request.getUserId());
            data.put("userName", user.getName());
            data.put("status", request.getStatus());
            data.put("requestedAt", request.getRequestedAt());

            response.add(data);
        }

        return response;
    }
}
