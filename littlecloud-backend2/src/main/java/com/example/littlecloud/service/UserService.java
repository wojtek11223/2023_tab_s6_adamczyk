package com.example.littlecloud.service;

import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.dto.UserUploadDTO;
import com.example.littlecloud.entity.User;

import java.util.List;

public interface UserService {
    void saveUser(UserDto userDto);

    void uploadUsername(String oldUsername, String newUsername);

    User findByEmail(String email);

    User findByName(String username);

    List<UserDto> findAllUsers();

    User findByEmailOrName(String username, String email);
}
