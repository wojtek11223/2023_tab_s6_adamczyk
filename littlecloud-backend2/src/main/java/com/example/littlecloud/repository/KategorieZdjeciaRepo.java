package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.KategorieZdjecia;
import com.example.littlecloud.entity.Zdjecia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KategorieZdjeciaRepo extends JpaRepository<KategorieZdjecia, Long> {
    @Query("SELECT kz.zdjecia FROM KategorieZdjecia kz WHERE kz.kategoria.idKategorii = :idcategory AND kz.kategoria.uzytkownik.name = :username")
    List<Zdjecia> findZdjeciaByKategoria_IdKategoriiAndKategoria_Uzytkownik_Name(@Param("idcategory") Long idcategory, @Param("username") String username);

    @Query("SELECT DISTINCT kz.zdjecia FROM KategorieZdjecia kz WHERE kz.zdjecia.id = :idzdjecia AND kz.kategoria.uzytkownik.name = :username")
    Zdjecia findZdjeciaByKategoria_IdZdjeciaAndKategoria_Uzytkownik_Name(@Param("idzdjecia") Long idzdjecia, @Param("username") String username);
}
