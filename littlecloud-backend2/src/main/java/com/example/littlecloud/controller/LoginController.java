package com.example.littlecloud.controller;

import com.example.littlecloud.dto.LoginDTO;
import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.service.UserService;
import com.example.littlecloud.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class LoginController {

    @Autowired
    private final UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;
    public LoginController(UserService userService,
                           AuthenticationManager authenticationManager
                           ) {
        this.userService = userService;
        this.authenticationManager =authenticationManager;
    }


    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody @NotNull LoginDTO loginDto) {
        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(loginDto.getUsername(), loginDto.getPassword());
        Authentication authenticationResponse =
                this.authenticationManager.authenticate(authenticationRequest);
        SecurityContextHolder.getContext().setAuthentication(authenticationResponse);
        return new ResponseEntity<>("User login successfully!...", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@NotNull @RequestBody UserDto user) {
        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }


        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }
    @GetMapping("/testt")
    public LoginDTO test(){
        return new LoginDTO("ok","123");
    }
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/test")
    public ResponseEntity<String> getProtectedResource() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            String username = userDetails.getUsername();
            // Możesz pobrać inne informacje, takie jak id, z UserDetails.
            ResponseEntity.ok(username);
        }
        return ResponseEntity.ok("dupa");
    }

}