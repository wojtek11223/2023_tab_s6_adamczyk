package com.example.littlecloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tag")
public class Tag {

    @Id
    @Column(name = "tag", nullable = false)
    private String tag;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_zdjęcia")
    private Zdjecia zdjecie;

    // Gettery, settery, konstruktory...
}