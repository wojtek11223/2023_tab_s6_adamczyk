package com.example.littlecloud.repository;

import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepo extends JpaRepository<Tag, Long> {
}
