package com.kordiukov.bioreactor.supplements.repos;

import com.kordiukov.bioreactor.supplements.models.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<Food, Integer> {

    Optional<Food> findByFoodName (String foodName);

    List<Food> findAllByFoodNameLike(String foodName);
}