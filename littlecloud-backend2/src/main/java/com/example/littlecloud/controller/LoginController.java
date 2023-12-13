package com.example.littlecloud.controller;

import com.example.littlecloud.config.CorsConfig;
import com.example.littlecloud.dto.*;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.KategorieZdjecia;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.entity.Zdjecia;
import com.example.littlecloud.repository.KategorieZdjeciaRepo;
import com.example.littlecloud.service.KategorieService;
import com.example.littlecloud.service.UserService;
import com.example.littlecloud.model.ErrorRes;
import com.example.littlecloud.service.ZdjeciaService;
import com.example.littlecloud.springjwt.JwtUtil;
import com.example.littlecloud.repository.ZdjeciaRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.IOException;
import java.sql.Date;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class LoginController {

    @Autowired
    private final UserService userService;

    @Autowired
    private KategorieService categoryService;

    @Autowired
    private ZdjeciaService zdjeciaService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ZdjeciaRepo zdjeciaRepo;

    @Autowired
    private KategorieZdjeciaRepo kategorieZdjeciaRepo;

    private final JwtUtil jwtUtil;
    public LoginController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil,KategorieZdjeciaRepo kategorieZdjeciaRepo) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.kategorieZdjeciaRepo =kategorieZdjeciaRepo;
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

    @GetMapping("/getAllImages")
    public ResponseEntity<List<ZdjeciaDTO>> getAllImages(@RequestParam(required = false) Long categoryId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<ZdjeciaDTO> images;
        if (categoryId != null) {
            images = zdjeciaService.getAllZdjeciaDTO(categoryId,authentication.getName());
        } else {
            return ResponseEntity.status(400).body(null);
        }

        return ResponseEntity.ok(images);
    }
    @PostMapping("/photo_upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                @RequestParam("nazwa") String nazwa,
                                                @RequestParam("dataWykonania") Date dataWykonania,
                                                @RequestParam("nazwaKategorii") String nazwaKategorii) {
        try {
            // Jeśli nie ma plików wyślij komunikat 
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a file");
            }
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Convert MultipartFile to byte array
            Kategorie kategorie = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(nazwaKategorii, authentication.getName());
            if(kategorie == null)
            {
                return ResponseEntity.badRequest().body("Nie istenieje podana kategoria");
            }
            byte[] imageData = file.getBytes();

            // Create a new Zdjecia entity
            Zdjecia zdjecia = new Zdjecia();
            zdjecia.setNazwa(nazwa);
            zdjecia.setDataWykonania(dataWykonania);
            zdjecia.setZdjecie(imageData);

            zdjeciaRepo.save(zdjecia);
            KategorieZdjecia kategorieZdjecia = new KategorieZdjecia(zdjecia,kategorie);
            kategorieZdjeciaRepo.save(kategorieZdjecia);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading file");
        }
    }
}