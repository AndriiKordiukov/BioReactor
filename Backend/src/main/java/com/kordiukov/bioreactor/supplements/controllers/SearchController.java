package com.kordiukov.bioreactor.supplements.controllers;

import com.kordiukov.bioreactor.supplements.models.ActiveForm;
import com.kordiukov.bioreactor.supplements.models.Food;
import com.kordiukov.bioreactor.supplements.models.nutrients.Mineral;
import com.kordiukov.bioreactor.supplements.models.nutrients.Nutrient;
import com.kordiukov.bioreactor.supplements.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.supplements.repos.ActiveFormRepository;
import com.kordiukov.bioreactor.supplements.repos.FoodRepository;
import com.kordiukov.bioreactor.supplements.repos.MineralRepository;
import com.kordiukov.bioreactor.supplements.repos.VitaminRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final MineralRepository MineralRepository;
    private final VitaminRepository VitaminRepository;
    private final FoodRepository FoodRepository;
    private final ActiveFormRepository activeFormRepository;

    private static final Logger logger = LogManager.getLogger(SearchController.class);

    public SearchController(MineralRepository MineralRepository, VitaminRepository VitaminRepository, FoodRepository FoodRepository, ActiveFormRepository activeFormRepository) {
        this.MineralRepository = MineralRepository;
        this.VitaminRepository = VitaminRepository;
        this.FoodRepository = FoodRepository;
        this.activeFormRepository = activeFormRepository;
    }


    @GetMapping("/match/{query}")
    public ResponseEntity<Map<String, List<?>>> searchByName(@PathVariable String query) {
        Map<String, List<?>> results = new HashMap<>();

        List<Mineral> mineralResults = MineralRepository.findAllByNameLike("%" + query + "%");
        results.put("mineralsFound", mineralResults);
        List<Vitamin> vitaminResults = VitaminRepository.findAllByNameLike("%" + query + "%");
        results.put("vitaminsFound", vitaminResults);
        List<Food> foodResults = FoodRepository.findAllByFoodNameLike("%" + query + "%");
        results.put("foodFound", foodResults);
        List<ActiveForm> activeFormResults = activeFormRepository.findAllByFormNameLike("%" + query + "%");
        results.put("activeFormsFound", activeFormResults);

        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/byName/{query}")
    public ResponseEntity<Object> searchByUniqueName(@PathVariable String query) {
        Optional<Mineral> mineral = MineralRepository.findByName(query);
        if (mineral.get() != null) {
            return new ResponseEntity<>(mineral, HttpStatus.OK);
        }
        Optional<Vitamin> vitamin = VitaminRepository.findByName(query);
        if (vitamin.get() != null) {
            return new ResponseEntity<>(vitamin, HttpStatus.OK);
        }
        Optional<Food> food = FoodRepository.findByFoodName(query);
        if (food.get() != null) {
            return new ResponseEntity<>(food, HttpStatus.OK);
        }
        Optional<ActiveForm> activeForm = activeFormRepository.findByFormName(query);
        if (activeForm.get() != null) {
            return new ResponseEntity<>(activeForm, HttpStatus.OK);
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.NOT_FOUND);
    }

    @GetMapping("/byId/{query}")
    public ResponseEntity<Object> searchByUniqueId(@PathVariable Integer query) {
        try {
            Optional<Mineral> mineral = MineralRepository.findById(query);
            if (mineral.isPresent()) {
                return ResponseEntity.ok(mineral.get());
            }

            Optional<Vitamin> vitamin = VitaminRepository.findById(query);
            if (vitamin.isPresent()) {
                return ResponseEntity.ok(vitamin.get());
            }

            Optional<Food> food = FoodRepository.findById(query);
            if (food.isPresent()) {
                return ResponseEntity.ok(food.get());
            }

            Optional<ActiveForm> activeForm = activeFormRepository.findById(query);
            if (activeForm.isPresent()) {
                return ResponseEntity.ok(activeForm.get());
            }

            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception
            logger.error("Error searching by ID: " + query, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing your request.");
        }
    }

}
