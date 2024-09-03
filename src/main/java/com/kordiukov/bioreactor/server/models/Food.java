package com.kordiukov.bioreactor.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "food")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id", nullable = false)
    private Integer id;

    @Column(name = "food_name", nullable = false, unique = true)
    @NotNull(message = "Food name cannot be null")
    @Size(min = 1, max = 100, message = "Food name must be between 1 and 100 characters")
    private String foodName;

    @Column(name = "food_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "nutritive_value", columnDefinition = "TEXT")
    String nutritiveValue;

    @Column(name = "food_image")
    private String image;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    private Set<FoodNutrientRelation> foodNutrientRelations = new HashSet<>();

    public Food(String foodName) {
        this.foodName = foodName;
    }

    public Food(String foodName, String description) {
        this.foodName = foodName;
        this.description = description;
    }

}
