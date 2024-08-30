package com.kordiukov.bioreactor.supplements.service;

import com.kordiukov.bioreactor.supplements.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.supplements.models.nutrients.Mineral;
import com.kordiukov.bioreactor.supplements.models.nutrients.Nutrient;
import com.kordiukov.bioreactor.supplements.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.supplements.repos.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class NutrientService {

    private final MineralRepository mineralRepository;
    private final VitaminRepository vitaminRepository;
    private final FoodRepository foodRepository;
    private final FoodNutrientRelationRepository foodNutrientRelationRepository;
//    private final NutrientRepository nutrientRepository;

    public NutrientService(MineralRepository mineralRepository, VitaminRepository vitaminRepository, FoodRepository foodRepository, FoodNutrientRelationRepository foodNutrientRelationRepository) {
        this.mineralRepository = mineralRepository;
        this.vitaminRepository = vitaminRepository;
        this.foodRepository = foodRepository;
        this.foodNutrientRelationRepository = foodNutrientRelationRepository;
    }


    public Optional<Vitamin> getVitaminByName(String name) {
        return vitaminRepository.findByName(name.replace('-', ' '));
    }

    public Optional<Mineral> getMineralByName(String name) {

        return mineralRepository.findByName(name);
    }

    public List<FoodNutrientRelation> getFoodRelationsByMineral(String name) {

        return getMineralByName(name)
                .map(Mineral::getId)
                .map(foodNutrientRelationRepository::findAllByNutrient)
                .orElse(Collections.emptyList());
    }


    public Vitamin getVitaminByNameLike(String name) {
        List<Vitamin> vitaminList = vitaminRepository.findAllByNameLike(name);
        return vitaminList.getFirst();
    }

}
