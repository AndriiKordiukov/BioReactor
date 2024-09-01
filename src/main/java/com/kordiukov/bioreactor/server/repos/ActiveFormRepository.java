package com.kordiukov.bioreactor.server.repos;

import com.kordiukov.bioreactor.server.models.ActiveForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActiveFormRepository extends JpaRepository<ActiveForm, Integer> {
    List<ActiveForm> findAllByNutrientId (Integer nutrientId);

    Optional<ActiveForm> findByFormName (String name);

    List<ActiveForm> findAllByFormNameLike(String formName);
}