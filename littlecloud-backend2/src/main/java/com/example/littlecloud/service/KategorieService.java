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
