package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepo extends JpaRepository<Tag, Long> {
    List<Tag> findAllByZdjecie_IdZdjecia(Long photoid);
}
