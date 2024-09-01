package com.kordiukov.bioreactor.server.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kordiukov.bioreactor.server.models.ActiveForm;
import com.kordiukov.bioreactor.server.repos.ActiveFormRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
@RequestMapping("/activeForms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ActiveFormController {

    private final ActiveFormRepository activeFormRepository;

    private final ObjectMapper objectMapper;

    private static final Logger logger = LogManager.getLogger(ActiveFormController.class);

    /* * ------------  READING DATABASE ------------ */

    @GetMapping({"/", ""})
    public Page<ActiveForm> getList(Pageable pageable) {
        return activeFormRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ActiveForm getOne(@PathVariable Integer id) {
        Optional<ActiveForm> activeFormOptional = activeFormRepository.findById(id);
        return activeFormOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));
    }

    @GetMapping("/by-ids")
    public List<ActiveForm> getMany(@RequestParam List<Integer> ids) {
        return activeFormRepository.findAllById(ids);
    }

    @GetMapping("/byNutrient/{id}")// GET ALL FORM BY NUTRIENT ID
    public List<ActiveForm> getFormsByNutrient(@PathVariable Integer id) {
        return activeFormRepository.findAllByNutrientId(id);
    }

    @GetMapping("/byName/{name}")
    public ActiveForm getByName(@PathVariable String name) {
        Optional<ActiveForm> activeFormOptional = activeFormRepository.findByFormName(name);
        return activeFormOptional.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with name `%s` not found".formatted(name)));
    }
    /* * ------------ CREATING ACTIVE FORMS ------------ */

    @PostMapping("/create")
    public ActiveForm create(@RequestBody ActiveForm activeForm) {
        return activeFormRepository.save(activeForm);
    }

    /* ? ------------ UPDATING ACTIVE FORMS ------------ */

    @PatchMapping("/{id}")
    public ActiveForm patch(@PathVariable Integer id, @RequestBody JsonNode patchNode) throws IOException {
        ActiveForm activeForm = activeFormRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity with id `%s` not found".formatted(id)));

        objectMapper.readerForUpdating(activeForm).readValue(patchNode);

        return activeFormRepository.save(activeForm);
    }

    @PatchMapping({"/", ""})
    public List<Integer> patchMany(@RequestParam List<Integer> ids, @RequestBody JsonNode patchNode) throws IOException {
        Collection<ActiveForm> activeForms = activeFormRepository.findAllById(ids);

        for (ActiveForm activeForm : activeForms) {
            objectMapper.readerForUpdating(activeForm).readValue(patchNode);
        }

        List<ActiveForm> resultActiveForms = activeFormRepository.saveAll(activeForms);
        return resultActiveForms.stream()
                .map(ActiveForm::getId)
                .toList();
    }

    /* ! ------------ DELETING FOOD ------------ */

    @DeleteMapping("/delete/{id}")
    public ActiveForm delete(@PathVariable Integer id) {
        logger.info("Получен DELETE запрос для ActiveForm с id: {}", id);
        ActiveForm activeForm = activeFormRepository.findById(id).orElse(null);
        if (activeForm != null) {
            activeFormRepository.delete(activeForm);
            logger.info("Успешно удален ActiveForm с id: {}", id);
        }
        return activeForm;
    }

   /* @DeleteMapping
    public void deleteMany(@RequestParam List<Integer> ids) {
        activeFormRepository.deleteAllById(ids);
    }*/
}