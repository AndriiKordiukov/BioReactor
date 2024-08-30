package com.kordiukov.bioreactor.supplements.models.nutrients;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "mineral")
public class Mineral extends Nutrient {

    // * Other fields are id, name, fullName
    // U.S. recommended dietary allowances per day (ages 19–70)
    @Column(name = "dosage", nullable = true, columnDefinition = "TEXT")
    private String RDA; //  Daily amount (900 μg/700 μg)

//    @OneToMany(mappedBy = "id")
//    private Set<ActiveForm> bestForms = new HashSet<>(); // Best absorbed chemical forms

    public Mineral(String name) {
        this.setName(name);
    }

    public Mineral(String name,
                   String fullName) {
        this.setName(name);
        this.setFullName(fullName);
    }

    public Mineral (String name,
                    String fullName,
                    String RDA) {
        this.setName(name);
        this.setFullName(fullName);
        this.RDA = RDA;
    }
}