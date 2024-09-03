package com.kordiukov.bioreactor.server.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FoodNutrientRelationDTO {

    private Integer id;
    private String foodName;
    private String nutrientName;
    private String formName;


    public FoodNutrientRelationDTO(Integer id, String foodName, String nutrientName, String formName) {
        this.id = id;
        this.foodName = foodName;
        this.nutrientName = nutrientName;
        this.formName = formName;
    }
}
