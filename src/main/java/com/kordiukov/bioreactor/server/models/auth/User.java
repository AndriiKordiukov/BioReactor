package com.kordiukov.bioreactor.server.models.auth;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)

    private Integer id;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Username cannot be empty")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Column(nullable = false)
    @NotNull(message = "Password cannot be empty")
    @Size(min = 3, max = 30, message = "Password must be between 3 and 30 characters")
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }


}