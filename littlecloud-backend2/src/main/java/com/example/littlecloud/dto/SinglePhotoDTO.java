package com.example.littlecloud.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SinglePhotoDTO {

    private String nazwa;

    private java.sql.Date dataWykonania;

    private String format;

    private String height;

    private String width;

    private byte[] zdjecie;
}
