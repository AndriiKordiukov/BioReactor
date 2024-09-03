package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.Food;
import com.kordiukov.bioreactor.server.repos.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/food")
@CrossOrigin
@Validated
@RequiredArgsConstructor
public class FoodController {

    private final FoodRepository foodRepository;

    private final ObjectMapper objectMapper;

    /* * ------------  READING DATABASE ------------ */
    @GetMapping({"/", ""})  // ? GET ALL FOOD
    public Page<Food> getList(Pageable pageable) {
        return foodRepository.findAll(pageable);
    }

    @GetMapping("/{id}") // ? GET ONE FOOD BY ID
    public Food getOne(@PathVariable Integer id) {
        Optional<Food> foodOptional = foodRepository.findById(id);
        return foodOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")
    public List<Food> getMany(@RequestParam List<Integer> ids) {
        return foodRepository.findAllById(ids);
    }

    @GetMapping("byName/{name}")
    public Food getFood(@PathVariable String name) {
        Optional<Food> food = foodRepository.findByFoodName(name);
        return  food.orElseThrow(()->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No food by name '%s'".formatted(name)));
    }


    /* * ------------ CREATING FOOD ------------ */

    @PostMapping("/create")
    public Food create(@RequestBody Food food) {

        Optional<Food> findFood = foodRepository.findByFoodName(food.getFoodName());
        return findFood.orElseGet(() -> foodRepository.save(food));

    }

    /* ? ------------ UPDATING FOOD ------------ */
    @PatchMapping("/{id}")
    public Food patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        Food food = foodRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(food).readValue(patchNode);

        return foodRepository.save(food);
    }

    @PatchMapping({"/", ""})
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<Food> foods = foodRepository.findAllById(ids);

        for (Food food : foods) {
            objectMapper.readerForUpdating(food).readValue(patchNode);
        }

        List<Food> resultFoods = foodRepository.saveAll(foods);
        return resultFoods.stream()
                .map(Food::getId)
                .toList();
    }
    /* ! ------------ DELETING FOOD ------------ */

    @DeleteMapping("/delete/{id}")
    public Food delete(@PathVariable Integer id) {
        Food food = foodRepository.findById(id).orElse(null);
        if (food != null) {
            foodRepository.delete(food);
        }
        return food;
    }

    /*@DeleteMapping({"/", ""})
    public void deleteMany(@RequestParam List<Integer> ids) {
        foodRepository.deleteAllById(ids);
    }
*/ // DELETE ALL
}
