package com.example.littlecloud.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditCategoryDTO {
    @Nullable
    private String parentCategory;
    private Long idcategory;
    private String newNameCategory;
}
