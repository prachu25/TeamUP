
package com.teamup.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamup.dto.CreateTeamRequest;
import com.teamup.dto.CreateTeamResponse;
import com.teamup.dto.TeamResponseDTO;
import com.teamup.entity.Hackathon;
import com.teamup.entity.IdempotencyKey;
import com.teamup.entity.Team;
import com.teamup.entity.TeamMember;
import com.teamup.entity.User;
import com.teamup.repository.TeamRepository;
import com.teamup.repository.UserRepository;

import tools.jackson.databind.ObjectMapper;

import com.teamup.repository.TeamMemberRepository;
import com.teamup.repository.HackathonParticipantRepository;
import com.teamup.repository.HackathonRepository;
import com.teamup.repository.IdempotencyKeyRepository;

@Service
public class TeamService {

        private final TeamRepository teamRepository;
        private final TeamMemberRepository teamMemberRepository;
        private final HackathonParticipantRepository hackathonParticipantRepository;
        private final UserRepository userRepo;

        private final IdempotencyKeyRepository idempotencyRepo;
        private final ObjectMapper objectMapper;
        private final AuditLogService auditLogServ;
        private final HackathonRepository hackRepo;

        public TeamService(
                        TeamRepository teamRepository,
                        TeamMemberRepository teamMemberRepository,
                        HackathonParticipantRepository hackathonParticipantRepository,
                        UserRepository userRepository,
                        IdempotencyKeyRepository idempotencyRepo,
                        ObjectMapper objectMapper,
                        AuditLogService auditLogServ,
                        HackathonRepository hackRepo) {

                this.teamRepository = teamRepository;
                this.teamMemberRepository = teamMemberRepository;
                this.hackathonParticipantRepository = hackathonParticipantRepository;
                this.userRepo = userRepository;
                this.idempotencyRepo = idempotencyRepo;
                this.objectMapper = objectMapper;
                this.auditLogServ = auditLogServ;
                this.hackRepo = hackRepo;

        }

        @Transactional
        public CreateTeamResponse createTeam(CreateTeamRequest request, Long userId, String key) {

                // a. validate key
                if (key == null || key.isBlank()) {
                        throw new IllegalArgumentException("Idempotenct key is required");
                }

                // b. check wheather request was alredy processed
                IdempotencyKey existing = idempotencyRepo.findByUserIdAndIdempotencyKey(userId, key).orElse(null);

                if (existing != null && existing.getExpiresAt().isAfter(LocalDateTime.now())) {

                        try {
                                return objectMapper.readValue(existing.getResponseData(), CreateTeamResponse.class);
                        } catch (Exception e) {
                                throw new IllegalStateException("Unable to read previous response", e);
                        }
                }

                // 1. Validate team size
                if (request.getMinMembers() < 1 ||
                                request.getMaxMembers() < request.getMinMembers()) {

                        throw new IllegalArgumentException(
                                        "Invalid team size. Minimum members must be at least 1 and cannot exceed maximum members");
                }

                // 2. Check hackathon participation
                boolean isParticipant = hackathonParticipantRepository
                                .existsByUserUserIdAndHackathonHackathonId(
                                                userId, request.getHackathonId());

                if (!isParticipant) {
                        throw new IllegalArgumentException(
                                        "You are not registered for this hackathon");
                }

                // 3. Check existing team membership
                boolean alreadyInTeam = teamMemberRepository
                                .existsByUserIdAndHackathonId(
                                                userId, request.getHackathonId());

                if (alreadyInTeam) {
                        throw new IllegalStateException(
                                        "You already belong to a team in this hackathon");
                }

                // 4. Create team
                Team team = new Team();

                team.setHackathonId(request.getHackathonId());
                team.setLeaderId(userId);
                team.setTeamName(request.getTeamName());
                team.setMinMembers(request.getMinMembers());
                team.setMaxMembers(request.getMaxMembers());

                Team savedTeam = teamRepository.save(team);

                // 5. Add creator as first team member
                TeamMember member = new TeamMember();

                member.setTeamId(savedTeam.getTeamId());
                member.setHackathonId(savedTeam.getHackathonId());
                member.setUserId(userId);

                teamMemberRepository.save(member);

                // 6. Prepare response
                CreateTeamResponse response = new CreateTeamResponse();

                response.setTeamId(savedTeam.getTeamId());
                response.setTeamName(savedTeam.getTeamName());
                response.setHackathonId(savedTeam.getHackathonId());
                response.setLeaderId(userId);
                response.setMessage("Team created!");

                // 8. save response with idemptency key
                try {
                        IdempotencyKey idempotency = new IdempotencyKey();

                        idempotency.setUserId(userId);
                        idempotency.setIdempotencyKey(key);

                        idempotency.setResponseData(objectMapper.writeValueAsString(response));

                        idempotencyRepo.save(idempotency);
                } catch (Exception e) {
                        throw new IllegalArgumentException("Unable to save idemptency response", e);
                }

                // 9. Save audit log
                try {
                        String details = objectMapper
                                        .writeValueAsString(java.util.Map.of("team_name", savedTeam.getTeamName()));

                        auditLogServ.logActivity(savedTeam.getTeamId(), userId, "TEAM_CREATED", details);
                } catch (Exception e) {
                        throw new IllegalArgumentException("Unable to saved audit log", e);
                }

                return response;
        }

        // ALL Teams
        public List<TeamResponseDTO> getAllTeams() {

                List<Team> teams = teamRepository.findAll();

                List<TeamResponseDTO> response = new ArrayList<>();

                for (Team team : teams) {

                        // 1. Get leader
                        User leader = userRepo.findById(team.getLeaderId())
                                        .orElseThrow(() -> new IllegalArgumentException("Leader not found!"));

                        // 2. Get hackathon
                        Hackathon hackathon = hackRepo.findById(team.getHackathonId())
                                        .orElseThrow(() -> new IllegalArgumentException("Hackathon not found!"));

                        // 3. Get team members
                        List<TeamMember> teamMembers = teamMemberRepository.findByTeamId(team.getTeamId());

                        List<String> memberNames = new ArrayList<>();

                        // 4. Get member names
                        for (TeamMember member : teamMembers) {

                                User user = userRepo.findById(member.getUserId())
                                                .orElseThrow(() -> new IllegalArgumentException("User not found"));

                                memberNames.add(user.getName());
                        }

                        // 5. Create DTO
                        TeamResponseDTO dto = new TeamResponseDTO();

                        dto.setTeamId(team.getTeamId());
                        dto.setTeamName(team.getTeamName());
                        dto.setHackathonName(hackathon.getName());
                        dto.setLeaderName(leader.getName());
                        dto.setLeaderId(team.getLeaderId());
                        dto.setCurrentMembers(teamMembers.size());
                        dto.setAvailableSeats(team.getMaxMembers() - teamMembers.size());
                        dto.setMembers(memberNames);

                        response.add(dto);
                }

                return response;
        }

        // Check whether user is a leader
        public boolean checkLeader(Long userId) {
                return teamRepository.existsByLeaderId(userId);
        }

        // Get only teams where user is leader
        public List<TeamResponseDTO> getMyTeams(Long userId) {

                List<Team> teams = teamRepository.findByLeaderId(userId);

                List<TeamResponseDTO> response = new ArrayList<>();

                for (Team team : teams) {

                        Hackathon hackathon = hackRepo.findById(team.getHackathonId())
                                        .orElseThrow(() -> new IllegalArgumentException("Hackathon not found"));

                        List<TeamMember> members = teamMemberRepository.findByTeamId(team.getTeamId());

                        TeamResponseDTO dto = new TeamResponseDTO();

                        dto.setTeamId(team.getTeamId());
                        dto.setTeamName(team.getTeamName());
                        dto.setHackathonName(hackathon.getName());
                        dto.setCurrentMembers(members.size());
                        dto.setAvailableSeats(
                                        team.getMaxMembers() - members.size());

                        response.add(dto);
                }

                return response;
        }
}
