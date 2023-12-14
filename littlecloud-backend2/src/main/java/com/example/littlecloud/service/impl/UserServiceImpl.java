package com.example.littlecloud.service.impl;

import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.dto.UserUploadDTO;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.enums.Role;
import com.example.littlecloud.repository.UserRepository;
import com.example.littlecloud.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setName(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        user.setRole(Role.USER);
        userRepository.save(user);
    }

    @Override
    public void uploadUsername(String oldUsername, String newUsername) {
        userRepository.updateUsername(oldUsername, newUsername);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByName(String username) {
        return userRepository.findByName(username);
    }

    @Override
    public User findByEmailOrName(String username, String email) {
        return userRepository.findByEmailOrName(email, username);
    }

    @Override
    public List<UserDto> findAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertEntityToDto)
                .collect(Collectors.toList());
    }

    private UserDto convertEntityToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getName());
        userDto.setEmail(user.getEmail());
        return userDto;
    }

}
