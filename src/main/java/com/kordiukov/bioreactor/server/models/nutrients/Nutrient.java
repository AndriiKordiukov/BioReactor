package com.kordiukov.bioreactor.server.models.nutrients;

import com.kordiukov.bioreactor.server.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.server.models.NutrientInteractions;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

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
    @NotNull(message = "Nutrient name cannot be null")
    @Size(min = 1, max = 100, message = "Nutrient name must be between 1 and 100 characters")
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

}