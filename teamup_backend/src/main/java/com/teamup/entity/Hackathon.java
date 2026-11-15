package com.teamup.entity;

import java.time.LocalDate;
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
@Table(name = "hackathons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hackathon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hackathon_id")
    private Long hackathonId;

    private String name;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

}
