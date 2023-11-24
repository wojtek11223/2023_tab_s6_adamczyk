package com.example.littlecloud.entity;

import com.example.littlecloud.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="uzytkownicy")
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_uzytkownik")
    private Long id;

    @Column(nullable=false, name = "nick")
    private String name;

    @Column(nullable=false, unique=true ,name = "email")
    private String email;

    @Column(nullable=false, name = "haslo")
    private String password;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "role", nullable = false)
    private Role role;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

}
