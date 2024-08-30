package com.kordiukov.bioreactor.supplements.models;

import jakarta.persistence.*;
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

    @Column(name = "form_name")
    private String formName;

    @Column(name = "form_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "nutrient_id", nullable = false)
    private Integer nutrientId;

}