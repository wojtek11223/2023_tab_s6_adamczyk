package com.example.littlecloud.config;
import com.example.littlecloud.entity.*;
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

    public DataLoader(KategorieZdjeciaRepo kategorieZdjeciaRepo, KategorieRepo kategoriaRepo, TagRepo tagRepo, UserRepository userRepository, ZdjeciaRepo zdjeciaRepo, PasswordEncoder passwordEncoder) {
        this.kategorieZdjeciaRepo = kategorieZdjeciaRepo;
        this.kategoriaRepo = kategoriaRepo;

        this.tagRepo = tagRepo;
        this.userRepository = userRepository;
        this.zdjeciaRepo = zdjeciaRepo;
        this.passwordEncoder = passwordEncoder;
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
                Zdjecia zdjecie = dodajPrzykladoweZdjecie("studenci przy maszynie", "2023-11-22", "studenci.jpg");
                dodajPrzykladoweKategorieZdjecia(zdjecie, kategorie1);
                dodajPrzykladowyTag(zdjecie, "zajęcia");
                dodajPrzykladowyTag(zdjecie, "studenci");
                Zdjecia zdjecie1 =dodajPrzykladoweZdjecie("kot za drzewem", "2022-01-26", "kot1.jpg");
                dodajPrzykladoweKategorieZdjecia(zdjecie1, kategorie2);
                dodajPrzykladowyTag(zdjecie1, "kotek");
                Zdjecia zdjecie2 =dodajPrzykladoweZdjecie("kot na balu", "2023-11-22", "kot4.jpg");
                dodajPrzykladoweKategorieZdjecia(zdjecie2, kategorie2);
                dodajPrzykladowyTag(zdjecie2, "kotek");
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }

    }
    private User dodajPrzykladowegoUsera(String nazwauzytkownika, String email,String haslo){
        User user = userRepository.findByEmailOrName(email,nazwauzytkownika);
        if(user== null)
        {
            user = new User();
            user.setName(nazwauzytkownika);
            user.setEmail(email);
            user.setRole(Role.USER);
            String encodedPassword = passwordEncoder.encode(haslo);
            user.setPassword(encodedPassword);
            userRepository.save(user);
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
