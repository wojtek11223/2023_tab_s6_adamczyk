package com.example.littlecloud.service;

import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.entity.User;

import java.util.List;

public interface UserService {
    void saveUser(UserDto userDto);

    User findByEmail(String email);

    User findByName(String username);

    List<UserDto> findAllUsers();
}
