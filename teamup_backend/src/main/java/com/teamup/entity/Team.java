package com.teamup.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "hackathon_id")
    private Long hackathonId;

    @Column(name = "leader_id")
    private Long leaderId;

    private String teamName;

    private Integer minMembers;

    private Integer maxMembers;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

}
