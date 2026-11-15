package com.teamup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class LoginResponseDTO {

    private Long userId;
    private String message;

}
