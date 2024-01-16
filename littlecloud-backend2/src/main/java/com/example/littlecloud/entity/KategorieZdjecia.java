package com.example.littlecloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Zdjecia zdjecia;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_kategorii")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Kategorie kategoria;
}