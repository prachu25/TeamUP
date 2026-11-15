package com.teamup.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamup.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}
