package com.kordiukov.bioreactor.server.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "nutrient_interactions")
public class NutrientInteractions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "nutrient1", nullable = false)
    private int firstNutrient;

    @Column(name = "nutrient2", nullable = false)
    private int secondNutrient;

    @Column(name = "interaction_description")
    private String interaction;

    public NutrientInteractions(int firstNutrient, int secondNutrient, String interaction) {
        this.firstNutrient = firstNutrient;
        this.secondNutrient = secondNutrient;
        this.interaction = interaction;
    }
}
