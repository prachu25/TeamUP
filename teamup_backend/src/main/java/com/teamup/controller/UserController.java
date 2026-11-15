package com.teamup.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teamup.entity.User;
import com.teamup.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userServ;

    public UserController(UserService userService) {
        this.userServ = userService;
    }

    // 1. Get All User
    @GetMapping
    public List<User> getAllUsers() {
        return userServ.getAllUsers();
    }

    // 2. Get User By Id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userServ.getUserById(id);
    }

    // 3. Update User
    @PutMapping("/{id}")
    public User UpdateUser(@PathVariable Long id, @RequestBody User user) {
        return userServ.updateUser(id, user);
    }

    // 4. Delete User
    @PostMapping("/logout")
    public ResponseEntity<String> logout(Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                email + " logged out successfully");
    }
}
