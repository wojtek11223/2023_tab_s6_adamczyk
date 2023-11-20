package com.example.littlecloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kategorie_zdjecia")
@IdClass(KategorieZdjeciaId.class)
public class KategorieZdjecia {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_zdjecia")
    private Zdjecia zdjecia;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_kategorii")
    private Kategorie kategoria;

}
