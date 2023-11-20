package com.example.littlecloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "kategorie")
public class Kategorie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_kategorii")
    private Long idKategorii;

    @Column(name = "nazwa_kategorii", nullable = false)
    private String nazwaKategorii;

    @ManyToOne
    @JoinColumn(name = "id_kat_nadrz")
    private Kategorie nadkategoria;

    @ManyToOne
    @JoinColumn(name = "id_uzytkownik", nullable = false)
    private User uzytkownik;

}