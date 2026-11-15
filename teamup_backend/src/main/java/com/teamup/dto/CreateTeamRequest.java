package com.teamup.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTeamRequest {

    @NotNull(message = "Hackathon ID is required")
    private Long hackathonId;

    @NotBlank(message = "Team name is required")
    @Size(min = 3, max = 100, message = "Team name must be between 3 and 100 characters")
    private String teamName;

    @NotNull(message = "Minimum Members is required")
    @Min(value = 1, message = "Minimum members must be at least 1")
    private Integer minMembers;

    @NotNull(message = "Maximum members is required")
    @Min(value = 1, message = "Maximum members must be at least 1")
    private Integer maxMembers;
}
