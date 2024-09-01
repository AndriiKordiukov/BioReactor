package com.kordiukov.bioreactor.server.controllers;

import com.kordiukov.bioreactor.server.models.ActiveForm;
import com.kordiukov.bioreactor.server.models.Food;
import com.kordiukov.bioreactor.server.models.nutrients.Mineral;
import com.kordiukov.bioreactor.server.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.server.repos.ActiveFormRepository;
import com.kordiukov.bioreactor.server.repos.FoodRepository;
import com.kordiukov.bioreactor.server.repos.MineralRepository;
import com.kordiukov.bioreactor.server.repos.VitaminRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final MineralRepository mineralRepository;
    private final VitaminRepository vitaminRepository;
    private final FoodRepository foodRepository;
    private final ActiveFormRepository activeFormRepository;

    private static final Logger logger = LogManager.getLogger(SearchController.class);

    public SearchController(MineralRepository mineralRepository, VitaminRepository vitaminRepository, FoodRepository foodRepository, ActiveFormRepository activeFormRepository) {
        this.mineralRepository = mineralRepository;
        this.vitaminRepository = vitaminRepository;
        this.foodRepository = foodRepository;
        this.activeFormRepository = activeFormRepository;
    }


    @GetMapping("/match/{query}")
    public ResponseEntity<Map<String, List<?>>> searchByName(@PathVariable String query) {
        Map<String, List<?>> results = new HashMap<>();

        List<Mineral> mineralResults = mineralRepository.findAllByNameLike("%" + query + "%");
        results.put("mineralsFound", mineralResults);
        List<Vitamin> vitaminResults = vitaminRepository.findAllByNameLike("%" + query + "%");
        results.put("vitaminsFound", vitaminResults);
        List<Food> foodResults = foodRepository.findAllByFoodNameLike("%" + query + "%");
        results.put("foodFound", foodResults);
        List<ActiveForm> activeFormResults = activeFormRepository.findAllByFormNameLike("%" + query + "%");
        results.put("activeFormsFound", activeFormResults);

        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/byName/{query}")
    public ResponseEntity<Object> searchByUniqueName(@PathVariable String query) {
        List<Object> results = new ArrayList<>();

        Optional<Mineral> mineral = mineralRepository.findByName(query);
        mineral.ifPresent(results::add);

        Optional<Vitamin> vitamin = vitaminRepository.findByName(query);
        vitamin.ifPresent(results::add);

        Optional<Food> food = foodRepository.findByFoodName(query);
        food.ifPresent(results::add);

        Optional<ActiveForm> activeForm = activeFormRepository.findByFormName(query);
        activeForm.ifPresent(results::add);

        if (!results.isEmpty()) {
            return new ResponseEntity<>(results, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new HashMap<>(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/byId/{query}")
    public ResponseEntity<Object> searchByUniqueId(@PathVariable Integer query) {
        List<Object> results = new ArrayList<>();

        Optional<Mineral> mineral = mineralRepository.findById(query);
        mineral.ifPresent(results::add);

        Optional<Vitamin> vitamin = vitaminRepository.findById(query);
        vitamin.ifPresent(results::add);

        Optional<Food> food = foodRepository.findById(query);
        food.ifPresent(results::add);

        Optional<ActiveForm> activeForm = activeFormRepository.findById(query);
        activeForm.ifPresent(results::add);

        if (!results.isEmpty()) {
            return new ResponseEntity<>(results, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new HashMap<>(), HttpStatus.NOT_FOUND);
        }
    }

}
