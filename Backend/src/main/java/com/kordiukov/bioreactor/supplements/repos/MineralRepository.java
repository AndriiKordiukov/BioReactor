package com.kordiukov.bioreactor.supplements.repos;

import com.kordiukov.bioreactor.supplements.models.nutrients.Mineral;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MineralRepository extends JpaRepository<Mineral, Integer> {

    Optional<Mineral> findByName (String name);

    List<Mineral> findAllByNameLike(String name);


}