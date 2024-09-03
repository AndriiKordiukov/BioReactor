package com.kordiukov.bioreactor.server.repos;

import com.kordiukov.bioreactor.server.dto.FoodNutrientRelationDTO;
import com.kordiukov.bioreactor.server.models.FoodNutrientRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface FoodNutrientRelationRepository extends JpaRepository<FoodNutrientRelation, Integer> {

    List<FoodNutrientRelation> findAllByNutrient(Integer id);

    List<FoodNutrientRelation> findAllByFood(Integer id);


//    NATIVE SQL
    @Query(value = """
            SELECT\s
                fnr.id,\s
                food.food_name AS food_name,\s
                COALESCE(mine.name, vita.name) AS nutrient_name,\s
                form.form_name AS form_name
            FROM\s
                food_nutrient_relation fnr
            LEFT JOIN\s
                food ON fnr.food_id = food.food_id
            LEFT JOIN\s
                mineral mine ON fnr.nutrient_id = mine.id
            LEFT JOIN\s
                vitamin vita ON fnr.nutrient_id = vita.id
            LEFT JOIN\s
                active_form form ON fnr.form_id = form.form_id
            WHERE\s
                fnr.id  = :id;""",
            nativeQuery = true)
    List<Map<String, Object>> findFoodNutrientRelationWithNamesById(@Param("id") Integer id);

}