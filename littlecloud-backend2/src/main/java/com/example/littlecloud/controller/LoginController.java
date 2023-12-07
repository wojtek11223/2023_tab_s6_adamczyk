package com.example.littlecloud.controller;

import com.example.littlecloud.dto.KategorieDTO;
import com.example.littlecloud.dto.LoginDTO;
import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.service.KategorieService;
import com.example.littlecloud.service.UserService;
import com.example.littlecloud.dto.LoginRes;
import com.example.littlecloud.model.ErrorRes;
import com.example.littlecloud.springjwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class LoginController {

    @Autowired
    private final UserService userService;

    @Autowired
    private KategorieService categoryService;

    @Autowired
    private AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;
    public LoginController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @ResponseBody
    @RequestMapping(value = "/login",method = RequestMethod.POST)
    public ResponseEntity authenticateUser(@RequestBody @NotNull LoginDTO loginDto) {
        try {
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
            String email = authentication.getName();
            User user = userService.findByName(loginDto.getUsername());
            String token = jwtUtil.createToken(user);
            LoginRes loginRes = new LoginRes(email, token);

            return ResponseEntity.ok(loginRes);

        } catch (BadCredentialsException e) {
            ErrorRes errorResponse = new ErrorRes(HttpStatus.BAD_REQUEST, "Nieprawidłowa nazwa użytkownika lub hasło");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            ErrorRes errorResponse = new ErrorRes(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@NotNull @RequestBody UserDto user) {
        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        User existingUser = userService.findByEmailOrName(user.getUsername(),user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Użytkownik o podanych danych już istnieje");
        }

        userService.saveUser(user);
        return ResponseEntity.ok("Użytkownik został pomyślnie dodany");
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
        return ResponseEntity.ok("Wylogowano pomyślnie");
    }


    @PostAuthorize("ROLE_ADMIN")
    @GetMapping("/test")
    public ResponseEntity<String> getProtectedResource() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        assert authentication != null;
        return ResponseEntity.ok(authentication.getName());
    }

    @GetMapping("/albums")
    public ResponseEntity<List<KategorieDTO>> getAllUserCategories() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<KategorieDTO> userCategories = categoryService.getAllUserCategories(authentication.getName());
        return ResponseEntity.ok(userCategories);
    }

    @GetMapping("/album/{categoryId}")
    public ResponseEntity<List<KategorieDTO>> getSubCategoryById(@PathVariable Long categoryId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<KategorieDTO> subCategories = categoryService.getSubCategoriesByParentId(categoryId,authentication.getName());
        return ResponseEntity.ok(subCategories);
    }
}