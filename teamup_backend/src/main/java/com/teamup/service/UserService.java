package com.teamup.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.teamup.entity.User;
import com.teamup.exception.UserNotFoundException;
import com.teamup.repository.UserRepository;

@Service
public class UserService {

    private UserRepository userRepo;

    public UserService(UserRepository userRepository) {
        this.userRepo = userRepository;
    }

    // 1. Get All Users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // 2. Get User By Id
    public User getUserById(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found"));
    }

    // 3. Update User
    public User updateUser(Long id, User updatUser) {

        if (!userRepo.existsById(id)) {
            throw new UserNotFoundException("User ID Not Found!");
        }

        User user = userRepo.findById(id).get();

        user.setName(updatUser.getName());
        user.setEmail(updatUser.getEmail());
        user.setTimezone(updatUser.getTimezone());

        return userRepo.save(user);
    }

    // 4. Delete User
    public String deleteUser(Long id) {

        User user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("user Not Found!"));

        userRepo.delete(user);

        return "User Deleted Sucessfully";
    }

}
