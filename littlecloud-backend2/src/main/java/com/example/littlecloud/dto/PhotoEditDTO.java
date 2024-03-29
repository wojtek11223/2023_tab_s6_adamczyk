package com.example.littlecloud.dto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhotoEditDTO {
    String name;
    Date date;
    String albumsName;
    String tags;
    Long photoid;
    @Nullable
    Long categoryid;
    List<String> tagsToDelete;
}
