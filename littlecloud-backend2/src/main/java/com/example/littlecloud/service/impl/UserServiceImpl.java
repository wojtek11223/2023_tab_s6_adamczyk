package com.example.littlecloud.service.impl;

import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.dto.UserUploadDTO;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.enums.Role;
import com.example.littlecloud.repository.KategorieRepo;
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

    private final KategorieRepo kategorieRepo;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder, KategorieRepo kategorieRepo) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.kategorieRepo = kategorieRepo;
    }

    @Override
    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setName(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        kategorieRepo.save(new Kategorie(null,"default",null,user));
    }

    @Override
    public void updateUser(User user) {
        userRepository.save(user);
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

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    private UserDto convertEntityToDto(User user){
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getName());
        userDto.setEmail(user.getEmail());
        return userDto;
    }

}
