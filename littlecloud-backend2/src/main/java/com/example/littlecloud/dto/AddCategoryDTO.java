package com.example.littlecloud.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestParam;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddCategoryDTO {
    String category;
    @Nullable
    Long parentCategory;
}
