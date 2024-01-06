package com.example.littlecloud.dto;

import com.example.littlecloud.entity.Kategorie;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KategorieDTO {
    private Long idKategorii;

    private String nazwaKategorii;
    @Nullable
    private Long id_kat_nadrz;
}
