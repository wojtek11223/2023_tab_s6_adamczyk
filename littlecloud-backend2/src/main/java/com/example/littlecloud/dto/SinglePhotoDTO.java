package com.example.littlecloud.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SinglePhotoDTO {

    private Long idZdjecia;
    private String nazwa;
    private java.sql.Date dataWykonania;
    private String format;
    private String height;
    private String width;
    private byte[] zdjecie;
    List<String> tags;

}
