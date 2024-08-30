package com.kordiukov.bioreactor.supplements.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.supplements.models.nutrients.Mineral;
import com.kordiukov.bioreactor.supplements.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.supplements.repos.VitaminRepository;
import com.kordiukov.bioreactor.supplements.service.NutrientService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
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
@RequestMapping("/vitamins")
@CrossOrigin
@RequiredArgsConstructor
public class VitaminController {

    private final VitaminRepository vitaminRepository;

    private final ObjectMapper objectMapper;
    private final NutrientService nutrientService;

    private static final Logger logger = LogManager.getLogger(VitaminController.class);

    /* * ------------  READING DATABASE ------------ */

    @GetMapping({"/", ""})
    public Page<Vitamin> getList(Pageable pageable) {
        return vitaminRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Vitamin getOne(@PathVariable Integer id) {
        Optional<Vitamin> vitaminOptional = vitaminRepository.findById(id);
        return vitaminOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")
    public List<Vitamin> getMany(@RequestParam List<Integer> ids) {
        return vitaminRepository.findAllById(ids);
    }

    @GetMapping("/byName/{name}")// GET ONE MINERAL BY NAME
    public Optional<Vitamin> getOneByName(@PathVariable String name) {

        logger.info("Searching Vitamin by Name '%s'".formatted(name));
        logger.warn(nutrientService.getVitaminByNameLike(name));

        return Optional.ofNullable(nutrientService.getVitaminByNameLike(name));
    }
    /* * ------------ CREATING MINERALS ------------ */

    @PostMapping("/create")
    public Vitamin create(@RequestBody Vitamin vitamin) {
        if (vitaminRepository.existsByName(vitamin.getName())) {
            return null;
        } else return vitaminRepository.save(vitamin);
    }

    /* ? ------------ UPDATING MINERALS ------------ */

    @PatchMapping("/{id}")
    public Vitamin patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        Vitamin vitamin = vitaminRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(vitamin).readValue(patchNode);

        return vitaminRepository.save(vitamin);
    }

    @PatchMapping({"/", ""})
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<Vitamin> vitamins = vitaminRepository.findAllById(ids);

        for (Vitamin vitamin : vitamins) {
            objectMapper.readerForUpdating(vitamin).readValue(patchNode);
        }

        List<Vitamin> resultVitamins = vitaminRepository.saveAll(vitamins);
        return resultVitamins.stream()
                .map(Vitamin::getId)
                .toList();
    }

    @DeleteMapping("/{id}")
    public Vitamin delete(@PathVariable Integer id) {
        Vitamin vitamin = vitaminRepository.findById(id).orElse(null);
        if (vitamin != null) {
            vitaminRepository.delete(vitamin);
        }
        return vitamin;
    }

/*    @DeleteMapping
    public void deleteMany(@RequestParam List<Integer> ids) {
        vitaminRepository.deleteAllById(ids);
    }*/
}
