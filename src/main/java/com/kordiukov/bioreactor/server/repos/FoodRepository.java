package com.kordiukov.bioreactor.server.repos;

import com.kordiukov.bioreactor.server.models.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<Food, Integer> {

    Optional<Food> findByFoodName (String foodName);

    List<Food> findAllByFoodNameLike(String foodName);

}