package com.kordiukov.bioreactor.server.models.nutrients;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "vitamin")
public class Vitamin extends Nutrient {

    // * Other fields are id, name, fullName
    // U.S. recommended dietary allowances per day (ages 19–70)
    @Column(name="dosage", columnDefinition = "TEXT")
    private String RDA; //  Daily amount (900 μg/700 μg)

    public Vitamin(String name) {
        this.setName(name);
    }

    public Vitamin(String name,
                   String fullName) {
        this.setName(name);
        this.setFullName(fullName);
    }

    public Vitamin (String name,
                    String fullName,
                    String RDA) {
        this.setName(name);
        this.setFullName(fullName);
        this.RDA = RDA;
    }


}