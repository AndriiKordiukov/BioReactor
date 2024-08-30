package com.kordiukov.bioreactor.supplements.repos;

import com.kordiukov.bioreactor.supplements.models.nutrients.Vitamin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VitaminRepository extends JpaRepository<Vitamin, Integer> {

    Optional<Vitamin> findByName (String name);

    boolean existsByName(String name);

    List<Vitamin> findAllByNameLike(String name);
}