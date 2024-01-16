package com.example.littlecloud.controller;

import com.example.littlecloud.security.CustomUserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.littlecloud.dto.*;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.KategorieZdjecia;
import com.example.littlecloud.entity.User;
import com.example.littlecloud.entity.Zdjecia;
import com.example.littlecloud.entity.Tag;
import com.example.littlecloud.repository.KategorieZdjeciaRepo;
import com.example.littlecloud.service.KategorieService;
import com.example.littlecloud.service.UserService;
import com.example.littlecloud.model.ErrorRes;
import com.example.littlecloud.service.ZdjeciaService;
import com.example.littlecloud.springjwt.JwtUtil;
import com.example.littlecloud.repository.ZdjeciaRepo;
import com.example.littlecloud.repository.TagRepo;
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
import org.springframework.http.ResponseEntity;

import com.example.littlecloud.repository.UserRepository;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;
import java.io.IOException;
import java.sql.Date;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

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
    private TagRepo tagRepo;

    @Autowired
    private KategorieZdjeciaRepo kategorieZdjeciaRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;
    public LoginController(ZdjeciaRepo zdjeciaRepo, UserService userService, UserRepository userRepository, CustomUserDetailsService userDetailsService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, KategorieZdjeciaRepo kategorieZdjeciaRepo, TagRepo tagRepo) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.zdjeciaRepo =zdjeciaRepo;
        this.kategorieZdjeciaRepo =kategorieZdjeciaRepo;
        this.tagRepo =tagRepo;
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
    public ResponseEntity<ZdjeciaKategorieDTO> getAllUserCategories() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<KategorieDTO> userCategories = categoryService.getAllUserCategories(authentication.getName());
        Kategorie kategorieDefault = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name("default", authentication.getName());
        if(kategorieDefault == null)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        List<ZdjeciaDTO> images = zdjeciaService.getAllZdjeciaDTO(kategorieDefault.getIdKategorii(),authentication.getName());
        return ResponseEntity.ok(new ZdjeciaKategorieDTO(images,userCategories,null));
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

    @PostMapping("/edit_photo")
    public ResponseEntity<String> editPhoto(@NotNull @RequestBody PhotoEditDTO photoEditDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Zdjecia zdjecia = kategorieZdjeciaRepo.findZdjeciaByKategoria_IdZdjeciaAndKategoria_Uzytkownik_Name(photoEditDTO.getPhotoid(), authentication.getName());
        if(zdjecia == null) {
            return ResponseEntity.badRequest().body("Nie ma takiego zdjęcia w bazie");
        }
        zdjecia.setDataWykonania(photoEditDTO.getDate());
        zdjecia.setNazwa(photoEditDTO.getName());
        zdjeciaService.addZdjecia(zdjecia);
        zdjeciaService.deleteTagsFromPhoto(zdjecia,photoEditDTO.getTagsToDelete());
        zdjeciaService.addTagsToPhoto(zdjecia, photoEditDTO.getTags());
        String niedodane = zdjeciaService.addCategoriesToPhoto(zdjecia, photoEditDTO.getAlbumsName(), authentication.getName());


        if (Objects.equals(niedodane, "")) {
            return ResponseEntity.ok("Zmiany zostały pomyślnie wprowadzone");
        } else {
            return ResponseEntity.ok("Zdjęcie zostało zmienione lecz nie dodano do : " + niedodane);
        }

    }

    @PostMapping("/edit_category")
    public  ResponseEntity<String> editCategory(@NotNull @RequestBody EditCategoryDTO editCategoryDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Kategorie kategoriatoedit = categoryService.findAllByIdKategoriiAndUzytkownik_Name(editCategoryDTO.getIdcategory(),authentication.getName());
        if(kategoriatoedit == null) {
            return ResponseEntity.badRequest().body("Nie ma takiego albumu");
        }
        if(!Objects.equals(kategoriatoedit.getNazwaKategorii(), editCategoryDTO.getNewNameCategory())) {
            Kategorie checkNewname = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(editCategoryDTO.getNewNameCategory(),authentication.getName());
            if(checkNewname != null) {
                return ResponseEntity.badRequest().body("Kategoria o podanej nazwie już istnieje");
            }
            kategoriatoedit.setNazwaKategorii(editCategoryDTO.getNewNameCategory());
        }
        if(editCategoryDTO.getParentCategory() == null)
        {
            kategoriatoedit.setNadkategoria(null);
        }
        else {
            Kategorie nadrzedna = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(editCategoryDTO.getParentCategory(),authentication.getName());
            if(nadrzedna== null){
               return ResponseEntity.badRequest().body("Nie ma takiego albumu nadrzednego");
            }
            else
            {
                kategoriatoedit.setNadkategoria(nadrzedna);
            }

        }

        categoryService.addCategory(kategoriatoedit);
        return ResponseEntity.ok("Udało się zmienić");
    }
    @PostMapping("/delete_category")
    public ResponseEntity<String> deleteCat(@NotNull @RequestBody DeleteCategoryDTO deleteCategoryDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(categoryService.findAllByIdKategoriiAndUzytkownik_Name(deleteCategoryDTO.getAlbumId(),authentication.getName()) != null) {
            categoryService.delete(deleteCategoryDTO.getAlbumId(), authentication.getName());
        }
        else {
            return ResponseEntity.badRequest().body("Nie ma takiej kategorii");
        }
        return ResponseEntity.ok("Udało się zmienić");
    }
    @PostMapping("/photo_upload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("wysokosc") String wysokosc,
                                                   @RequestParam("szerokosc") String szerokosc,
                                                @RequestParam("nazwa") String nazwa,
                                                @RequestParam("dataWykonania") Date dataWykonania,
                                                @RequestParam("nazwaKategorii") String nazwaKategorii,
                                                @RequestParam("tagi") String tagi) {
        try {
            // Jeśli nie ma plików wyślij komunikat 
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload a file");
            }
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Kategorie defaultKategoria = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name("default", authentication.getName());
            if(defaultKategoria == null)
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
            zdjeciaService.addZdjecia(zdjecia);

            zdjeciaService.addTagsToPhoto(zdjecia,tagi);

            kategorieZdjeciaRepo.save(new KategorieZdjecia(zdjecia,defaultKategoria));
            String niedodane_kategorieValue = zdjeciaService.addCategoriesToPhoto(zdjecia,nazwaKategorii,authentication.getName());
            if (Objects.equals(niedodane_kategorieValue, "")) {
                return ResponseEntity.ok("Plik został pomyślnie dodany" );
            } else {
                return ResponseEntity.ok("Zdjęcie zostało dodane lecz nie w kategoriach: " + niedodane_kategorieValue);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading file");
        }

    }

    @PostMapping("/delete_photo")
    public ResponseEntity<String> deletephoto(@NotNull @RequestBody DeletephotoDTO deletephotoDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Zdjecia zdjecie = zdjeciaService.getZdjeciaById(deletephotoDTO.getPhotoid());
            if(zdjecie== null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Nie ma zdjęcia takiego");
            }
            Kategorie defaultkategorii = categoryService.findAllByNazwaKategoriiAndUzytkownik_Name("default",authentication.getName());
            if(deletephotoDTO.getCategoryid() == null)
            {
                zdjeciaService.deleteZdjecia(zdjecie);
            }
            else
            {
                Long idkategorii = Long.parseLong(deletephotoDTO.getCategoryid());
                Kategorie kategorie = categoryService.findAllByIdKategoriiAndUzytkownik_Name(idkategorii,authentication.getName());
                zdjeciaService.deleteZdjeciafromCategory(new KategorieZdjecia(zdjecie,kategorie));
            }

            return ResponseEntity.ok("Zdjęcie zostało pomyślnie usunięte");
        } catch (NumberFormatException e) {
            // Obsłuż wyjątek, jeśli konwersja nie powiedzie się
            System.err.println("Błąd konwersji: " + e.getMessage());
            return null;
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
        if (categoryId != null) {
            List<ZdjeciaDTO> images = zdjeciaService.getAllZdjeciaDTO(categoryId,authentication.getName());
            List<KategorieDTO> subCategories = categoryService.getSubCategoriesByParentId(categoryId,authentication.getName());
            String nazwaKategorii = categoryService.findAllByIdKategoriiAndUzytkownik_Name(categoryId,authentication.getName()).getNazwaKategorii();
            return ResponseEntity.ok(new ZdjeciaKategorieDTO(images,subCategories, nazwaKategorii));
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