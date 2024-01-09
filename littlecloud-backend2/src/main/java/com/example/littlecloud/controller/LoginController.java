package com.example.littlecloud.controller;

import com.example.littlecloud.security.CustomUserDetailsService;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.repository.UserRepository;

import java.nio.file.attribute.UserPrincipal;
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
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    public LoginController(UserService userService, UserRepository userRepository, CustomUserDetailsService userDetailsService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, KategorieZdjeciaRepo kategorieZdjeciaRepo) {
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

    @GetMapping("/profile")
    public ResponseEntity<UserInfoDTO> ShowUserData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user1 = userService.findByName(authentication.getName());
        return ResponseEntity.ok(new UserInfoDTO(user1.getName(), user1.getEmail()));

        }

    @PostMapping("/uploadUser")
    public ResponseEntity<String> uploadUser(@NotNull @RequestBody UserDto user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User existingUser = userService.findByName(authentication.getName());

        User existingUsernameCheck = userService.findByName(user.getUsername());
        if (existingUsernameCheck != null && !existingUsernameCheck.getId().equals(existingUser.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Konto o podanej nazwie istnieje");
        }

        User existingEmailCheck = userService.findByEmail(user.getEmail());
        if (existingEmailCheck != null && !existingEmailCheck.getId().equals(existingUser.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Konto o podanym adresie email istnieje");
        }


        if (user.getUsername() != null && !user.getEmail().isEmpty()) {
            existingUser.setName(user.getUsername());
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            existingUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        userService.updateUser(existingUser);

        return ResponseEntity.ok(jwtUtil.createToken(existingUser));
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

    @GetMapping("/photo/{photoId}")
    public ResponseEntity<SinglePhotoDTO> getPhoto(@PathVariable Long photoId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<ZdjeciaDTO> images;
        if (photoId != null) {
            SinglePhotoDTO singlePhotoDTO = zdjeciaService.getZdjecieByIdAndUsername(photoId,authentication.getName());
            return ResponseEntity.ok(singlePhotoDTO);
        } else {
            return ResponseEntity.status(400).body(null);
        }
    }
    @PostMapping("/photo_upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("wysokosc") String wysokosc,
                                                   @RequestParam("szerokosc") String szerokosc,
                                                @RequestParam("nazwa") String nazwa,
                                                @RequestParam("dataWykonania") Date dataWykonania,
                                                @RequestParam("nazwaKategorii") String nazwaKategorii) {
        try {
            // Jeśli nie ma plików wyślij komunikat 
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a file");
            }
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Kategorie kategorie = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(nazwaKategorii, authentication.getName());
            if(kategorie == null)
            {
                return ResponseEntity.badRequest().body("Nie istenieje podana kategoria");
            }
            byte[] imageData = file.getBytes();

            Zdjecia zdjecia = new Zdjecia();
            zdjecia.setNazwa(nazwa);
            zdjecia.setDataWykonania(dataWykonania);
            zdjecia.setZdjecie(imageData);
            zdjecia.setFormat(file.getContentType());
            zdjecia.setWidth(szerokosc);
            zdjecia.setHeight(wysokosc);
            zdjecia.setMiniaturkaFromOriginal();

            zdjeciaRepo.save(zdjecia);
            KategorieZdjecia kategorieZdjecia = new KategorieZdjecia(zdjecia,kategorie);
            kategorieZdjeciaRepo.save(kategorieZdjecia);
            return ResponseEntity.ok("Plik został pomyślnie dodany");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading file");
        }
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
    @GetMapping("/album/{categoryId}")
    public ResponseEntity<ZdjeciaKategorieDTO> getImages(@PathVariable Long categoryId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<ZdjeciaDTO> images;
        if (categoryId != null) {
            images = zdjeciaService.getAllZdjeciaDTO(categoryId, authentication.getName());
            List<KategorieDTO> subCategories = categoryService.getSubCategoriesByParentId(categoryId, authentication.getName());
            return ResponseEntity.ok(new ZdjeciaKategorieDTO(images, subCategories));
        } else {
            return ResponseEntity.status(400).body(null);
        }
    }
    @PostMapping("/add_category")
    public ResponseEntity<String> handleNewCategory(@NotNull @RequestBody AddCategoryDTO addCategoryDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Kategorie kategorie = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(addCategoryDTO.getCategory(), authentication.getName());
        if(kategorie != null)
        {
            return ResponseEntity.badRequest().body("Istenieje podana kategoria");
        }
        Kategorie kategoria = new Kategorie();
        if(addCategoryDTO.getParentCategory() == null)
        {
            kategoria.setNadkategoria(null);
        }
        else {
            Kategorie currentParentCat = categoryService.findAllByIdKategoriiAndUzytkownik_Name(addCategoryDTO.getParentCategory(), authentication.getName());
            if(currentParentCat == null)
            {
                return ResponseEntity.badRequest().body("Nie istenieje kategoria rodzic");
            }
            if(categoryService.counterUnderCategories(currentParentCat.getIdKategorii(),authentication.getName()) >= 2)
            {
                return ResponseEntity.badRequest().body("Ta kategoria jest zbyt zagnieżdzona");
            }
            kategoria.setNadkategoria(currentParentCat);
        }

        User currentUser = userService.findByName(authentication.getName());
        kategoria.setNazwaKategorii(addCategoryDTO.getCategory());
        kategoria.setUzytkownik(currentUser);
        categoryService.addCategory(kategoria);
        return ResponseEntity.ok("Cat uploaded successfully");
    }

}