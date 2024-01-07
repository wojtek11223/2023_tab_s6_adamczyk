package com.example.littlecloud.dto;

import com.example.littlecloud.entity.Zdjecia;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZdjeciaDTO {

    private Long idZdjecia;
    private String nazwa;
    private String format;
    private Date dataWykonania;
    private byte[] miniaturka;
    List<String> tags;

}
