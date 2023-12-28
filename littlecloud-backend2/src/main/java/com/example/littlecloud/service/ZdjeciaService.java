package com.example.littlecloud.service;
import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.example.littlecloud.dto.SinglePhotoDTO;
import com.example.littlecloud.dto.ZdjeciaDTO;
import com.example.littlecloud.entity.Zdjecia;
import com.example.littlecloud.repository.KategorieZdjeciaRepo;
import com.example.littlecloud.repository.ZdjeciaRepo;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZdjeciaService {

    private final KategorieZdjeciaRepo kategorieZdjeciaRepo;

    private final ZdjeciaRepo zdjeciaRepo;

    public ZdjeciaService(ZdjeciaRepo zdjeciaRepo, KategorieZdjeciaRepo kategorieZdjeciaRepo){
        this.kategorieZdjeciaRepo =kategorieZdjeciaRepo;
        this.zdjeciaRepo= zdjeciaRepo;
    }
    public List<Zdjecia> getAllZdjecia() {
        return zdjeciaRepo.findAll();
    }

    public Zdjecia getZdjeciaById(Long id) {
        return zdjeciaRepo.findById(id).orElse(null);
    }

    public List<Zdjecia> getZdjeciaByCategoryAndFormat(Long idcategory, String username) {
        return kategorieZdjeciaRepo.findZdjeciaByKategoria_IdKategoriiAndKategoria_Uzytkownik_Name(idcategory, username);
    }

    public SinglePhotoDTO getZdjecieByIdAndUsername(Long photoid, String username) {
        Zdjecia zdjecia = kategorieZdjeciaRepo.findZdjeciaByKategoria_IdZdjeciaAndKategoria_Uzytkownik_Name(photoid, username);
        return new SinglePhotoDTO(
                zdjecia.getNazwa(),
                zdjecia.getDataWykonania(),
                zdjecia.getFormat(),
                zdjecia.getHeight(),
                zdjecia.getWidth(),
                zdjecia.getZdjecie()
        );
    }

    public Zdjecia addZdjecia(Zdjecia zdjecia) {
        // Tutaj możesz dodać logikę walidacji, przetwarzania, itp.
        return zdjeciaRepo.save(zdjecia);
    }

    public void deleteZdjecia(Long id) {
        zdjeciaRepo.deleteById(id);
    }

    public List<ZdjeciaDTO> getAllZdjeciaDTO(Long idcategory, String username) {
        List<Zdjecia> zdjeciaList = kategorieZdjeciaRepo.findZdjeciaByKategoria_IdKategoriiAndKategoria_Uzytkownik_Name(idcategory, username);

        return zdjeciaList.stream()
                .map(this::mapToZdjeciaDTO)
                .collect(Collectors.toList());
    }

    private ZdjeciaDTO mapToZdjeciaDTO(Zdjecia zdjecia) {
        String format = getImageFormat(zdjecia.getZdjecie());

        return new ZdjeciaDTO(
                zdjecia.getIdZdjecia(),
                zdjecia.getNazwa(),
                zdjecia.getFormat(),
                zdjecia.getMiniaturka()
        );
    }
    private String getImageFormat(byte[] imageData) {
        try (InputStream inputStream = new ByteArrayInputStream(imageData)) {
            Metadata metadata = ImageMetadataReader.readMetadata(inputStream);
            Iterable<Directory> directories = metadata.getDirectories();

            for (Directory directory : directories) {
                if (directory.containsTag(ExifSubIFDDirectory.TAG_COMPRESSION)) {
                    int compressionType = directory.getInt(ExifSubIFDDirectory.TAG_COMPRESSION);
                    switch (compressionType) {
                        case 6:
                            return "jpeg";
                        case 1:
                            return "gif";
                        case 7:
                            return "png";
                        default:
                            return "unknown";
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "unknown";
    }
}