package com.example.littlecloud.repository;

import com.example.littlecloud.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByName(String name);
    User findByEmailOrName(String email, String name);
    @Modifying
    @Query("UPDATE User u SET u.username = :newUsername WHERE u.username = :oldUsername")
    void updateUsername(@Param("oldUsername") String oldusername, @Param("newUsername") String newUsername);


}
