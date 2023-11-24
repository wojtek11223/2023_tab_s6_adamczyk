package com.example.littlecloud.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KategorieZdjeciaId implements Serializable {
    private Long zdjecia;
    private Long kategoria;

}