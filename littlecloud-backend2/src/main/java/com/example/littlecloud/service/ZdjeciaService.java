package com.example.littlecloud.service;
import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.example.littlecloud.dto.SinglePhotoDTO;
import com.example.littlecloud.dto.ZdjeciaDTO;
import com.example.littlecloud.dto.ZdjeciaKategorieDTO;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.entity.KategorieZdjecia;
import com.example.littlecloud.entity.Zdjecia;
import com.example.littlecloud.repository.KategorieZdjeciaRepo;
import com.example.littlecloud.repository.TagRepo;
import com.example.littlecloud.entity.Tag;
import com.example.littlecloud.repository.ZdjeciaRepo;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

import java.io.InputStream;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class ZdjeciaService {

    private final KategorieZdjeciaRepo kategorieZdjeciaRepo;

    private final ZdjeciaRepo zdjeciaRepo;

    private final KategorieService categoryService;
    private final TagRepo tagRepo;

    public ZdjeciaService(ZdjeciaRepo zdjeciaRepo, KategorieZdjeciaRepo kategorieZdjeciaRepo, KategorieService categoryService, TagRepo tagRepo){
        this.kategorieZdjeciaRepo =kategorieZdjeciaRepo;
        this.zdjeciaRepo= zdjeciaRepo;
        this.categoryService = categoryService;
        this.tagRepo = tagRepo;
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
                zdjecia.getIdZdjecia(),
                zdjecia.getNazwa(),
                zdjecia.getDataWykonania(),
                zdjecia.getFormat(),
                zdjecia.getHeight(),
                zdjecia.getWidth(),
                zdjecia.getZdjecie(),
                tagRepo.findAllByZdjecie_IdZdjecia(photoid).stream().map(Tag::getTag).collect(Collectors.toList())
        );
    }

    public Zdjecia addZdjecia(Zdjecia zdjecia) {
        // Tutaj możesz dodać logikę walidacji, przetwarzania, itp.
        return zdjeciaRepo.save(zdjecia);
    }

    public void deleteZdjecia(Zdjecia zdjecie) {
        zdjeciaRepo.delete(zdjecie);
    }

    public void deleteZdjeciafromCategory(KategorieZdjecia kategorieZdjecia) {
        kategorieZdjeciaRepo.delete(kategorieZdjecia);
    }
    public void addTagsToPhoto (Zdjecia zdjecia,String tagi) {
        if (!tagi.isEmpty()){
            List<String> tags = List.of(tagi.split(","));
            tags.forEach(tag1 -> {
                if(tagRepo.findAllByZdjecie_IdZdjeciaAndTag(zdjecia.getIdZdjecia(), tag1) == null) {
                    Tag Tag = new Tag();
                    Tag.setTag(tag1.trim());
                    Tag.setZdjecie(zdjecia);
                    tagRepo.save(Tag);
                }
            });
        }
    }

    public String addCategoriesToPhoto (Zdjecia zdjecia, String categories, String username) {
        AtomicReference<String> niedodane_kategorie = new AtomicReference<>("");
        if(!categories.isEmpty()) {
            List<String> listakategorie = List.of(categories.split(","));
            listakategorie.forEach(cat -> {
                Kategorie kategoria =  categoryService.findAllByNazwaKategoriiAndUzytkownik_Name(cat.trim(), username);
                if(kategoria == null)
                {
                    niedodane_kategorie.updateAndGet(value -> value + cat.trim() + " ");
                }
                else
                    kategorieZdjeciaRepo.save(new KategorieZdjecia(zdjecia,kategoria));
            });
        }
        return niedodane_kategorie.get();
    }
    public void deleteTagsFromPhoto(Zdjecia zdjecia,List<String> tagsToDelete) {
        tagsToDelete.forEach(tag -> {
            tagRepo.delete(new Tag(tag,zdjecia));
        });
    }
    public List<ZdjeciaDTO> getAllZdjeciaDTO(Long idcategory, String username) {
        List<Zdjecia> zdjeciaList = kategorieZdjeciaRepo.findZdjeciaByKategoria_IdKategoriiAndKategoria_Uzytkownik_Name(idcategory, username);

        return zdjeciaList.stream()
                .map(this::mapToZdjeciaDTO)
                .collect(Collectors.toList());
    }

    private ZdjeciaDTO mapToZdjeciaDTO(Zdjecia zdjecia) {
        return new ZdjeciaDTO(
                zdjecia.getIdZdjecia(),
                zdjecia.getNazwa(),
                zdjecia.getFormat(),
                zdjecia.getDataWykonania(),
                zdjecia.getMiniaturka(),
                tagRepo.findAllByZdjecie_IdZdjecia(zdjecia.getIdZdjecia()).stream().map(Tag::getTag).collect(Collectors.toList())
        );
    }
}