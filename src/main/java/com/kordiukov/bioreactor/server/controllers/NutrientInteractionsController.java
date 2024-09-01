package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.NutrientInteractions;
import com.kordiukov.bioreactor.server.repos.NutrientInteractionsRepository;
import com.kordiukov.bioreactor.server.service.NutrientService;
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
@RequestMapping("/interactions")
@RequiredArgsConstructor
public class NutrientInteractionsController {

    private final NutrientInteractionsRepository nutrientInteractionsRepository;

    private final ObjectMapper objectMapper;
    private final NutrientService nutrientService;

    /* * ------------ READING INTERACTIONS FROM DATABASE ------------ */
    @GetMapping
    public Page<NutrientInteractions> getList(Pageable pageable) {
        return nutrientInteractionsRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public NutrientInteractions getOne(@PathVariable Integer id) {
        Optional<NutrientInteractions> nutrientInteractionsOptional = nutrientInteractionsRepository.findById(id);
        return nutrientInteractionsOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")
    public List<NutrientInteractions> getMany(@RequestParam List<Integer> ids) {
        return nutrientInteractionsRepository.findAllById(ids);
    }

    @GetMapping("/byNutrient/{id}")
    public List<NutrientInteractions> getManyByNutrient(@PathVariable Integer id) {
        List<NutrientInteractions> interactions = nutrientInteractionsRepository.findAllByFirstNutrient(id); // Find all by first Nutrient ID
        interactions.addAll(nutrientInteractionsRepository.findAllBySecondNutrient(id)); // Add to the list all by second Nutrient ID
        return interactions; // Return a complete list of all matches
    }


    /* * ------------ CREATING INTERACTIONS ------------ */

    @PostMapping("/create")
    public NutrientInteractions create(@RequestBody NutrientInteractions nutrientInteractions) {
        return nutrientInteractionsRepository.save(nutrientInteractions);
    }

    /* ? ------------ UPDATING INTERACTIONS ------------ */

    @PatchMapping("/{id}")
    public NutrientInteractions patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        NutrientInteractions nutrientInteractions = nutrientInteractionsRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(nutrientInteractions).readValue(patchNode);

        return nutrientInteractionsRepository.save(nutrientInteractions);
    }

    @PatchMapping
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<NutrientInteractions> nutrientInteractions = nutrientInteractionsRepository.findAllById(ids);

        for (NutrientInteractions nutrientInteraction : nutrientInteractions) {
            objectMapper.readerForUpdating(nutrientInteraction).readValue(patchNode);
        }

        List<NutrientInteractions> resultNutrientInteractions = nutrientInteractionsRepository.saveAll(nutrientInteractions);
        return resultNutrientInteractions.stream()
                .map(NutrientInteractions::getId)
                .toList();
    }

    /* ! ------------ DELETING INTERACTIONS ------------ */

    @DeleteMapping("/{id}")
    public NutrientInteractions delete(@PathVariable Integer id) {
        NutrientInteractions nutrientInteractions = nutrientInteractionsRepository.findById(id).orElse(null);
        if (nutrientInteractions != null) {
            nutrientInteractionsRepository.delete(nutrientInteractions);
        }
        return nutrientInteractions;
    }

    @DeleteMapping
    public void deleteMany(@RequestParam List<Integer> ids) {
        nutrientInteractionsRepository.deleteAllById(ids);
    }
}
