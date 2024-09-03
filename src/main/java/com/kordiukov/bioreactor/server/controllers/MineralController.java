package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.nutrients.Mineral;
import com.kordiukov.bioreactor.server.repos.MineralRepository;
import com.kordiukov.bioreactor.server.service.NutrientService;
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
@RequestMapping("/minerals")
@RequiredArgsConstructor
@Validated
//@CrossOrigin(origins = "127.0.0.1")
public class MineralController {

    private final MineralRepository mineralRepository;

    private final ObjectMapper objectMapper;
    private final NutrientService nutrientService;

    /* * ------------  READING DATABASE ------------ */

    @GetMapping({"/", ""})     // GET ALL MINERALS
    public Page<Mineral> getList(Pageable pageable) {
        return mineralRepository.findAll(pageable);
    }

    @GetMapping("/{id}")// GET ONE MINERAL BY ID
    public Mineral getOne(@PathVariable Integer id) {
        Optional<Mineral> mineralOptional = mineralRepository.findById(id);
        return mineralOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")// GET ALL MINERALS BY THEIR IDs
    public List<Mineral> getMany(@RequestParam List<Integer> ids) {
        return mineralRepository.findAllById(ids);
    }

    @GetMapping("/byName/{name}")// GET ONE MINERAL BY NAME
    public Optional<Mineral> getOneByName(@PathVariable String name) {
        return Optional.ofNullable(nutrientService.getMineralByName(name).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No food by name '%s'".formatted(name))));
    }


    /* * ------------ CREATING MINERALS ------------ */

    @PostMapping("/create")
    public Mineral create(@RequestBody Mineral mineral) {
        if (mineralRepository.findByName(mineral.getName()).isPresent()) {
            return mineralRepository.findByName(mineral.getName()).get();
        } else return mineralRepository.save(mineral);
    }


    /* ? ------------ UPDATING MINERALS ------------ */

    @PatchMapping("/{id}")
    public Mineral patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        Mineral mineral = mineralRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(mineral).readValue(patchNode);

        return mineralRepository.save(mineral);
    }

    @PatchMapping({"/", ""})
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<Mineral> minerals = mineralRepository.findAllById(ids);

        for (Mineral mineral : minerals) {
            objectMapper.readerForUpdating(mineral).readValue(patchNode);
        }

        List<Mineral> resultMinerals = mineralRepository.saveAll(minerals);
        return resultMinerals.stream()
                .map(Mineral::getId)
                .toList();
    }

    /* ! ------------ DELETING MINERAL ------------ */
    @DeleteMapping("/{id}")
    public Mineral delete(@PathVariable Integer id) {
        Mineral mineral = mineralRepository.findById(id).orElse(null);
        if (mineral != null) {
            mineralRepository.delete(mineral);
        }
        return mineral;
    }

/*    @DeleteMapping
    public void deleteMany(@RequestParam List<Integer> ids) {
        mineralRepository.deleteAllById(ids);
    }*/
}
