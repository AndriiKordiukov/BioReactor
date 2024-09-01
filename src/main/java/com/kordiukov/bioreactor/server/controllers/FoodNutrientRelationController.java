package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.server.models.nutrients.Mineral;
import com.kordiukov.bioreactor.server.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.server.repos.FoodNutrientRelationRepository;
import com.kordiukov.bioreactor.server.repos.MineralRepository;
import com.kordiukov.bioreactor.server.repos.VitaminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/foodNutrientRelations")
@CrossOrigin
@RequiredArgsConstructor
public class FoodNutrientRelationController {

    private final FoodNutrientRelationRepository foodNutrientRelationRepository;

    private final ObjectMapper objectMapper;
    private final VitaminRepository vitaminRepository;
    private final MineralRepository mineralRepository;

    /* * ------------  READING DATABASE ------------ */

    @GetMapping({"/", ""})
    public Page<FoodNutrientRelation> getList(Pageable pageable) {
        return foodNutrientRelationRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public FoodNutrientRelation getOne(@PathVariable Integer id) {
        Optional<FoodNutrientRelation> foodNutrientRelationOptional = foodNutrientRelationRepository.findById(id);
        return foodNutrientRelationOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")
    public List<FoodNutrientRelation> getMany(@RequestParam List<Integer> ids) {
        return foodNutrientRelationRepository.findAllById(ids);
    }

    @GetMapping("/byNutrient/{id}")
    public List<FoodNutrientRelation> getManyByNutrient(@PathVariable Integer id) {
        return foodNutrientRelationRepository.findAllByNutrient(id);
    }

    @GetMapping("/byFood/{id}")
    public List<FoodNutrientRelation> getManyByFood(@PathVariable Integer id) {
        return foodNutrientRelationRepository.findAllByFood(id);
    }

    @GetMapping("/byNutrientId/{id}")
    public Optional<Object> getNutrientById(@PathVariable Integer id) {
        Optional<Vitamin> vitamin = vitaminRepository.findById(id);

        if (vitamin.isPresent())
            return Optional.of(vitamin.get());
        // Если не найдено, ищем в mineralRepository
        Optional<Mineral> mineral = mineralRepository.findById(id);
        if (mineral.isPresent())
            return Optional.of(mineral.get());
        // Если не найдено ни в одном репозитории, возвращаем пустой Optional
        return Optional.empty();
    }

    /* * ------------ CREATING RELATION ------------ */

    @PostMapping("/create")
    public FoodNutrientRelation create(@RequestBody FoodNutrientRelation foodNutrientRelation) {
        return foodNutrientRelationRepository.save(foodNutrientRelation);
    }

    /* ? ------------ UPDATING RELATION ------------ */

    @PatchMapping("/{id}")
    public FoodNutrientRelation patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        FoodNutrientRelation foodNutrientRelation = foodNutrientRelationRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(foodNutrientRelation).readValue(patchNode);

        return foodNutrientRelationRepository.save(foodNutrientRelation);
    }

    @PatchMapping({"/", ""})
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<FoodNutrientRelation> foodNutrientRelations = foodNutrientRelationRepository.findAllById(ids);

        for (FoodNutrientRelation foodNutrientRelation : foodNutrientRelations) {
            objectMapper.readerForUpdating(foodNutrientRelation).readValue(patchNode);
        }

        List<FoodNutrientRelation> resultFoodNutrientRelations = foodNutrientRelationRepository.saveAll(foodNutrientRelations);
        return resultFoodNutrientRelations.stream()
                .map(FoodNutrientRelation::getId)
                .toList();
    }

    /* ? ------------ UPDATING RELATION ------------ */

    @DeleteMapping("/{id}")
    public FoodNutrientRelation delete(@PathVariable Integer id) {
        FoodNutrientRelation foodNutrientRelation = foodNutrientRelationRepository.findById(id).orElse(null);
        if (foodNutrientRelation != null) {
            foodNutrientRelationRepository.delete(foodNutrientRelation);
        }
        return foodNutrientRelation;
    }

/*    @DeleteMapping
    public void deleteMany(@RequestParam List<Integer> ids) {
        foodNutrientRelationRepository.deleteAllById(ids);
    }*/
}
