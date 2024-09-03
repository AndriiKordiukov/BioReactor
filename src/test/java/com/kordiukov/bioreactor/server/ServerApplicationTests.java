package com.kordiukov.bioreactor.server;

import com.kordiukov.bioreactor.server.dto.FoodNutrientRelationDTO;
import com.kordiukov.bioreactor.server.models.FoodNutrientRelation;
import com.kordiukov.bioreactor.server.models.nutrients.Mineral;
import com.kordiukov.bioreactor.server.models.nutrients.Vitamin;
import com.kordiukov.bioreactor.server.repos.FoodNutrientRelationRepository;
import com.kordiukov.bioreactor.server.repos.MineralRepository;
import com.kordiukov.bioreactor.server.service.NutrientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ServerApplicationTests {

    @Autowired
    private MineralRepository mineralRepository;

    @Autowired
    private FoodNutrientRelationRepository foodNutrientRelationRepository;

    @Autowired
    private NutrientService nutrientService;

    private Mineral testMineral;

    @Test
    public void testFindAll() {
        List<Mineral> allMinerals = mineralRepository.findAll();
        assertFalse(allMinerals.isEmpty(), "Mineral table should not be empty");
        assertTrue(allMinerals.size() > 10, "Mineral table contains more then 10 lines");
        testMineral = allMinerals.getFirst();
    }

    @Test
    public void testFindById() {
        Optional<Mineral> mineral = mineralRepository.findById(24);
        assertTrue(mineral.isPresent(), "Mineral by id 24 is in the table");
        assertEquals(24, mineral.get().getId());
    }

    @Test
    public void testGetFoodRelationsByMineral() {
        List<Mineral> allMinerals = mineralRepository.findAll();
        int index = (int) (Math.random() * allMinerals.size());
        testMineral = allMinerals.get(1);

        List<FoodNutrientRelation> relations = nutrientService.getFoodRelationsByMineral(testMineral.getName());

        assertFalse(relations.isEmpty());
    }

    @Test
    public void testGetVitaminByNameLike() {
        Vitamin likeVitamin = nutrientService.getVitaminByNameLike("Vitamin C");

        assertTrue(likeVitamin.getId() != 0);
        assertTrue(likeVitamin.getName().contains("Vitamin C"));
    }

    @Test
    void testFindFoodNutrientRelationWithNamesById() {
        Integer testId = 58;

        Optional<FoodNutrientRelationDTO> result = nutrientService.getFoodNutrientRelationWithNamesById(testId);

        assertThat(result).isPresent();
        if(result.isPresent()) {
        FoodNutrientRelationDTO dto = result.get();
        assertThat(dto.getFoodName()).isEqualTo("Butter");
        assertThat(dto.getNutrientName()).isEqualTo("Vitamin A");
        assertThat(dto.getFormName()).isEqualTo("Retinal");
        }
    }


}
