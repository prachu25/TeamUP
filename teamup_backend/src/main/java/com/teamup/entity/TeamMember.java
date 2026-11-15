package com.teamup.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "team_members", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "hackathon_id", "user_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "team_id", nullable = false)
    private Long teamId;

    @Column(name = "hackathon_id", nullable = false)
    private Long hackathonId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "joined_at", insertable = false, updatable = false)
    private LocalDateTime joinedAt;

}
