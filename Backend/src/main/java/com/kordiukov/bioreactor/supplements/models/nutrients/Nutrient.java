package com.kordiukov.bioreactor.supplements.models.nutrients;

import com.kordiukov.bioreactor.supplements.models.ActiveForm;
import com.kordiukov.bioreactor.supplements.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.supplements.models.NutrientInteractions;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Nutrient {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // ... common properties and methods for all nutrient types
    @Column(name="name", nullable = false, unique = true)
    private String name; // Regular Name (Vitamin A)

    @Column(name="fullName", unique = true)
    private String fullName; // Scientific name (Retinol)

    @Column(name="nutrient_type")
    private String nutrientType; // mineral, vitamin, aminoacid

    @Column(name="short_description", columnDefinition = "TEXT")
    private String shortDescription; // short description for a card and page

    @Column(name="image_link", length = 100)
    private String image;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutrient_id")
    private Set<FoodNutrientRelation> foodNutrientRelations;

    @OneToMany(mappedBy = "firstNutrient", fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private Set<NutrientInteractions> interactions;

    @Override
    public String toString() {
        return "Nutrient " + nutrientType  +
                ", name - '" + name + '\'' +
                "id = " + id;
    }
}