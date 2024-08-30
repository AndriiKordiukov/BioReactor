package com.kordiukov.bioreactor.supplements.repos;

import com.kordiukov.bioreactor.supplements.models.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    boolean existsByUsername(String username);
}
