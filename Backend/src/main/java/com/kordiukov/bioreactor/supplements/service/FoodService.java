package com.kordiukov.bioreactor.supplements.service;

import com.kordiukov.bioreactor.supplements.models.Food;
import com.kordiukov.bioreactor.supplements.repos.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class FoodService {
    private final FoodRepository foodRepository;

    public Optional<Food> getFoodByName(String name){
        Optional<Food> food = foodRepository.findByFoodName(name);
        return food;
    }


}
