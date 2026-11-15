package com.teamup.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "email is reqiured!")
    @Email(message = "Enter a valid Email")
    private String email;

    @NotBlank(message = "password is required!")
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;

}
