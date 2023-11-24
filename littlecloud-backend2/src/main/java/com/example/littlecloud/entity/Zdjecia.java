package com.example.littlecloud.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "zdjecia")
public class Zdjecia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_zdjecia")
    private Long idZdjecia;

    @Column(name = "nazwa")
    private String nazwa;

    @Column(name = "data_wykonania", nullable = false)
    private java.sql.Date dataWykonania;

    @Lob
    @Column(name = "zdjecie", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] zdjecie;
    
}