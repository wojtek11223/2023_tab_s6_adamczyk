package com.example.littlecloud.dto;

import com.example.littlecloud.entity.KategorieZdjecia;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ZdjeciaKategorieDTO {
    private List<ZdjeciaDTO> zdjeciaDTO;
    private List<KategorieDTO> kategorieDTO;
    private String nazwaKategorii;
}
