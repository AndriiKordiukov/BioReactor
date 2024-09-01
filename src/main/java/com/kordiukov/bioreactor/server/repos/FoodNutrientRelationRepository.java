package com.kordiukov.bioreactor.server.repos;

import com.kordiukov.bioreactor.server.models.FoodNutrientRelation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodNutrientRelationRepository extends JpaRepository<FoodNutrientRelation, Integer> {

    List<FoodNutrientRelation> findAllByNutrient(Integer id);

    List<FoodNutrientRelation> findAllByFood(Integer id);

}