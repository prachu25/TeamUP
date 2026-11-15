package com.teamup.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTeamResponse {

    private Long teamId;
    private String teamName;
    private Long hackathonId;
    private Long leaderId;
    private String message;
}
