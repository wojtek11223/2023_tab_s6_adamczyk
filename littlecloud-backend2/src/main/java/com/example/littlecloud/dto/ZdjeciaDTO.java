package com.example.littlecloud.dto;

import com.example.littlecloud.entity.Zdjecia;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZdjeciaDTO {

    private Zdjecia zdjecia;
    private String format;

}
