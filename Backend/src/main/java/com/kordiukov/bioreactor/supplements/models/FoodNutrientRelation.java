package com.kordiukov.bioreactor.supplements.models;

import com.kordiukov.bioreactor.supplements.models.nutrients.Nutrient;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "food_nutrient_relation")
public class FoodNutrientRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String amount;

    @Column(name = "relation_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "form_id")
    private Integer forms;

    @Column(name = "food_id")
    private Integer food;

    @Column(name = "nutrient_id")
    private Integer nutrient;

}