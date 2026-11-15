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
public class RegisterRequestDTO {

    @NotBlank(message = "Name is required!")
    private String name;

    @NotBlank(message = "Email is required!")
    @Email(message = "Enter valid email")
    private String email;

    @NotBlank(message = "password is required!")
    @Size(min = 6, message = "password must be at least 6 characters!")
    private String password;

    @NotBlank(message = "Timezone is required")
    private String timezone;
}
