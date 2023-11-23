package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.Zdjecia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZdjeciaRepo extends JpaRepository<Zdjecia, Long> {
}
