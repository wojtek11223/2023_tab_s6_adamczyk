package com.example.littlecloud.service;

import com.example.littlecloud.dto.KategorieDTO;
import com.example.littlecloud.entity.Kategorie;
import com.example.littlecloud.repository.KategorieRepo;
import com.example.littlecloud.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KategorieService {
    private final KategorieRepo kategorieRepo;
    private final UserRepository userRepository;

    public KategorieService(KategorieRepo kategorieRepo, UserRepository userRepository) {
        this.kategorieRepo = kategorieRepo;
        this.userRepository = userRepository;
    }
    public List<KategorieDTO> getAllUserCategories(String username) {
        List<Kategorie> kategories = kategorieRepo.findAllByUzytkownik_Name(username);
        return kategories.stream()
                .map(this::mapKategorieToDTO)
                .collect(Collectors.toList());
    }
    public List<KategorieDTO> getSubCategoriesByParentId(Long parentid, String username) {
        List<Kategorie> kategories = kategorieRepo.findAllByUzytkownik_NameAndNadkategoria_IdKategorii(username,parentid);
        return kategories.stream()
                .map(this::mapKategorieToDTO)
                .collect(Collectors.toList());
    }

    public Kategorie findAllByNazwaKategoriiAndUzytkownik_Name(String namecategory, String username){
        return kategorieRepo.findAllByNazwaKategoriiAndUzytkownik_Name(namecategory,username);
    }

    public Kategorie findAllByIdKategoriiAndUzytkownik_Name(Long idcategory, String username){
        return kategorieRepo.findAllByIdKategoriiAndUzytkownik_Name(idcategory,username);
    }
    public Long counterUnderCategories(Long ParentId, String username) {
        Kategorie kategorie = kategorieRepo.findAllByIdKategoriiAndUzytkownik_Name(ParentId,username);
        if(kategorie.getNadkategoria() == null)
        {
            return 0L;
        }
        else
        {
            return  counterUnderCategories(kategorie.getNadkategoria().getIdKategorii(),username) + 1;
        }
    }

    private KategorieDTO mapKategorieToDTO(Kategorie kategorie) {
        KategorieDTO kategorieDTO = new KategorieDTO();
        kategorieDTO.setIdKategorii(kategorie.getIdKategorii());
        kategorieDTO.setNazwaKategorii(kategorie.getNazwaKategorii());
        if(kategorie.getNadkategoria() == null) {
            kategorieDTO.setId_kat_nadrz(null);
        } else {
            kategorieDTO.setId_kat_nadrz(kategorie.getNadkategoria().getIdKategorii());
        }
        return kategorieDTO;
    }

    public Kategorie addCategory(Kategorie category) {
        return kategorieRepo.save(category);
    }
}
