package com.teamup.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeamResponseDTO {

    private Long teamId;
    private String teamName;
    private String hackathonName;
    private String leaderName;
    private Long leaderId;
    private Integer currentMembers;
    private Integer availableSeats;
    private List<String> members;

}
