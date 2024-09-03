package com.kordiukov.bioreactor.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "active_form")
public class ActiveForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "form_id", nullable = false)
    private Integer id;

    @NotNull(message = "Form name cannot be null")
    @Size(min = 1, max = 100, message = "Form name must be between 1 and 100 characters")
    @Column(name = "form_name")
    private String formName;

    @Column(name = "form_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "nutrient_id", nullable = false)
    private Integer nutrientId;

}