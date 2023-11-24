package com.example.littlecloud.repository;

import com.example.littlecloud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByName(String name);
    User findByEmailOrName(String email, String name);
}
