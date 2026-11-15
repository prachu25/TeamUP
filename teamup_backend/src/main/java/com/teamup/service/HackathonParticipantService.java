package com.teamup.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teamup.entity.Hackathon;
import com.teamup.entity.HackathonParticipant;
import com.teamup.entity.Team;
import com.teamup.entity.TeamMember;
import com.teamup.entity.User;
import com.teamup.exception.AlreadyParticipatingException;
import com.teamup.exception.HackathonNotFoundException;
import com.teamup.exception.UserNotFoundException;
import com.teamup.repository.HackathonParticipantRepository;
import com.teamup.repository.HackathonRepository;
import com.teamup.repository.TeamMemberRepository;
import com.teamup.repository.TeamRepository;
import com.teamup.repository.UserRepository;

@Service
public class HackathonParticipantService {

    private HackathonParticipantRepository hackParticipantRepo;
    private HackathonRepository hackRepo;
    private UserRepository userRepo;
    private TeamMemberRepository team_memRepo;
    private TeamRepository teamRepo;
    private AuditLogService auditLogServ;

    public HackathonParticipantService(
            HackathonParticipantRepository participantRepository,
            HackathonRepository hackathonRepository,
            UserRepository userRepository,
            TeamMemberRepository teamMemberRepository,
            TeamRepository teamRepository,
            AuditLogService auditLogService) {

        this.hackParticipantRepo = participantRepository;
        this.hackRepo = hackathonRepository;
        this.userRepo = userRepository;
        this.team_memRepo = teamMemberRepository;
        this.teamRepo = teamRepository;
        this.auditLogServ = auditLogService;
    }

    // Participat in hackathon
    public String participate(Long userId, Long hackathonId) {

        // Check hackathon
        Hackathon hackathon = hackRepo.findById(hackathonId)
                .orElseThrow(() -> new HackathonNotFoundException("Hackathon not found!"));

        // check User
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User Not Found with ID: " + userId));

        // check existing participation
        if (hackParticipantRepo.existsByUserUserIdAndHackathonHackathonId(userId, hackathonId)) {
            throw new AlreadyParticipatingException("Already paticipating in this hackathon");
        }

        // create participation
        HackathonParticipant participant = new HackathonParticipant();
        participant.setUser(user);
        participant.setHackathon(hackathon);

        hackParticipantRepo.save(participant);

        return "Successfully registered for hackathon";
    }

    // Cancle Participation
    @Transactional
    public String cancleParticipation(Long userId, Long hackathonId) {

        // 1. check participation
        boolean exists = hackParticipantRepo.existsByUserUserIdAndHackathonHackathonId(userId, hackathonId);

        if (!exists) {
            throw new UserNotFoundException("Participation Not Found!");
        }

        // 2. find user's team membership
        Optional<TeamMember> member = team_memRepo.findByUserIdAndHackathonId(userId, hackathonId);

        if (member.isPresent()) {

            TeamMember teamMember = member.get();
            Long teamId = teamMember.getTeamId();

            // 3. Remove user from team
            team_memRepo.delete(teamMember);

            // 4. Check remaning team memebers
            List<TeamMember> members = team_memRepo.findByTeamId(teamId);

            if (members.isEmpty()) {

                // Delete team if last memeber leaves
                auditLogServ.logActivity(
                        teamId,
                        userId,
                        "TEAM_DELETED",
                        "{\"reason\":\"Last member left the team\"}");

                teamRepo.deleteById(teamId);
            } else {

                // Record member leaving
                auditLogServ.logActivity(
                        teamId,
                        userId,
                        "MEMBER_LEFT",
                        "{\"reason\":\"Member cancelled participation\"}");

                // 5.Trasfer leadership if user was leader
                Team team = teamRepo.findById(teamId)
                        .orElseThrow(() -> new IllegalArgumentException("Team not Found!"));

                if (team.getLeaderId().equals(userId)) {

                    team.setLeaderId(members.get(0).getUserId());
                    teamRepo.save(team);
                }
            }
        }

        // 6. Delete Hackathon Participation
        hackParticipantRepo.deleteByUserUserIdAndHackathonHackathonId(userId, hackathonId);

        return "Participation cancelled successfully";
    }

}
