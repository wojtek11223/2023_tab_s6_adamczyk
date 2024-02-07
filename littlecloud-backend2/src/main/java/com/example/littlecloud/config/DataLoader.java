package com.example.littlecloud.config;
import com.example.littlecloud.dto.UserDto;
import com.example.littlecloud.entity.*;
import com.example.littlecloud.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.littlecloud.enums.Role;
import com.example.littlecloud.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;


@Component
public class DataLoader implements CommandLineRunner {

    private final KategorieZdjeciaRepo kategorieZdjeciaRepo;
    private final KategorieRepo kategoriaRepo;
    private final TagRepo tagRepo;
    private final UserRepository userRepository;
    private final ZdjeciaRepo zdjeciaRepo;
    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    public DataLoader(KategorieZdjeciaRepo kategorieZdjeciaRepo, KategorieRepo kategoriaRepo, TagRepo tagRepo, UserRepository userRepository, ZdjeciaRepo zdjeciaRepo, PasswordEncoder passwordEncoder, UserService userService) {
        this.kategorieZdjeciaRepo = kategorieZdjeciaRepo;
        this.kategoriaRepo = kategoriaRepo;

        this.tagRepo = tagRepo;
        this.userRepository = userRepository;
        this.zdjeciaRepo = zdjeciaRepo;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        try {
            User user1 = dodajPrzykladowegoUsera("TypowyStudent", "toja@mail.pl", "haslo123");
            if(user1 != null)
            {
                Kategorie kategorie1 = dodajPrzykladoweKategorie(user1,"Moje fotki");
                Kategorie kategorie2 = dodajPrzykladoweKategorie(user1,"Zwierzątka", kategorie1);
                Kategorie kategorie3 = dodajPrzykladoweKategorie(user1,"Inne", kategorie1);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

    }
    private User dodajPrzykladowegoUsera(String nazwauzytkownika, String email,String haslo){
        User user = userRepository.findByEmailOrName(email,nazwauzytkownika);
        if(user== null)
        {
            userService.saveUser(new UserDto(null,nazwauzytkownika,email,haslo));
            user = userRepository.findByEmailOrName(email,nazwauzytkownika);
            return user;
        }
        else
            return null;
    }
    private Kategorie dodajPrzykladoweKategorie(User user1, String nazwakategorii){
        Kategorie kategorie = new Kategorie();
        kategorie.setNazwaKategorii(nazwakategorii);
        kategorie.setUzytkownik(user1);
        kategoriaRepo.save(kategorie);
        return kategorie;
    }

    private Kategorie dodajPrzykladoweKategorie(User user1, String nazwakategorii, Kategorie kategorie1){
        Kategorie kategorie = new Kategorie();
        kategorie.setNazwaKategorii(nazwakategorii);
        kategorie.setNadkategoria(kategorie1);
        kategorie.setUzytkownik(user1);
        kategoriaRepo.save(kategorie);
        return kategorie;
    }

    private void dodajPrzykladoweKategorieZdjecia(Zdjecia zdjecie, Kategorie kategoria){
        KategorieZdjecia kategorieZdjecia = new KategorieZdjecia();
        kategorieZdjecia.setZdjecia(zdjecie);
        kategorieZdjecia.setKategoria(kategoria);
        kategorieZdjeciaRepo.save(kategorieZdjecia);
    }
    private void dodajPrzykladowyTag(Zdjecia zdjecie, String nazwatagu){
        Tag tag = new Tag();
        tag.setTag(nazwatagu);
        tag.setZdjecie(zdjecie);
        tagRepo.save(tag);
    }
    private Zdjecia dodajPrzykladoweZdjecie(String nazwazdjecia, String datawykonania, String zdjeciewalbumie) throws IOException {
        Path currentPath = Paths.get("").toAbsolutePath().resolve("przykladoweZdjecia").resolve(zdjeciewalbumie);
        String projectFolderPath = currentPath.toString();
        System.out.println("Pełna ścieżka: " + projectFolderPath);
        Zdjecia zdjecie = new Zdjecia();
        zdjecie.setNazwa(nazwazdjecia);
        zdjecie.setDataWykonania(java.sql.Date.valueOf(datawykonania));
        byte[] zdjecieBitowo = Files.readAllBytes(currentPath);
        zdjecie.setZdjecie(zdjecieBitowo);
        zdjeciaRepo.save(zdjecie);
        return zdjecie;
    }
}
