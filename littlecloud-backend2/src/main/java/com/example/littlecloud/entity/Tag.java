package com.example.littlecloud.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tag")
@IdClass(TagId.class)
public class Tag {

    @Id
    @Column(name = "tag", nullable = false)
    private String tag;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_zdjęcia")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Zdjecia zdjecie;

}