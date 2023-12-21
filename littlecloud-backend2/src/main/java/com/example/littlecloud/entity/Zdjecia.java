package com.example.littlecloud.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.coobird.thumbnailator.Thumbnails;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

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

    @Column(name = "format")
    private String format;

    @Column(name = "wysokosc")
    private String height;

    @Column(name = "szerokosc")
    private String width;
    @Lob
    @Column(name = "zdjecie", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] zdjecie;

    @Lob
    @Column(name = "miniaturka", columnDefinition = "LONGBLOB", nullable = true)
    private byte[] miniaturka;


    public void setMiniaturkaFromOriginal() {
        try {
            if (zdjecie != null) {
                miniaturka = resizeImage(zdjecie, 500, 375); // dostosuj rozmiar według własnych potrzeb
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // Metoda pomocnicza do zmniejszania rozmiaru obrazu
    private byte[] resizeImage(byte[] inputImage, int targetWidth, int targetHeight) throws IOException {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(inputImage);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Thumbnails.of(inputStream)
                    .size(targetWidth, targetHeight)
                    .outputFormat(this.format.substring(format.lastIndexOf("/") + 1))
                    .toOutputStream(outputStream);

            return outputStream.toByteArray();
        }
    }
}