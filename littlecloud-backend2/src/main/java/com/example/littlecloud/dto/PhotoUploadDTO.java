package com.example.littlecloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PhotoUploadDTO {

   private MultipartFile file;
   private String nazwa;
   private String wysokosc;
   private String szerokosc;
   private Date dataWykonania;
   private String nazwaKategorii;
   private String tagi;
}
