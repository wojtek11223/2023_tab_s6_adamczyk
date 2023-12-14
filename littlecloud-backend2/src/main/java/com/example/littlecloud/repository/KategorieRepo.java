package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KategorieRepo extends JpaRepository<Kategorie, Long> {
    List<Kategorie> findAllByUzytkownik_Name(String username);

    Kategorie findAllByNazwaKategoriiAndUzytkownik_Name(String namecategory, String username);
    List<Kategorie> findAllByUzytkownik_NameAndNadkategoria_IdKategorii(String username, Long id);
}
