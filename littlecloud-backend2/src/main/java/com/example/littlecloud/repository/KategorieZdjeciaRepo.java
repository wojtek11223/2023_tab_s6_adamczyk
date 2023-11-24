package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.KategorieZdjecia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KategorieZdjeciaRepo extends JpaRepository<KategorieZdjecia, Long> {
}
