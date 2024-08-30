package com.kordiukov.bioreactor.supplements.repos;

import com.kordiukov.bioreactor.supplements.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.supplements.models.NutrientInteractions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NutrientInteractionsRepository extends JpaRepository<NutrientInteractions, Integer> {

    List<NutrientInteractions> findAllByFirstNutrient(Integer id);

    List<NutrientInteractions> findAllBySecondNutrient(Integer id);

}