package com.project.habit_management.repository;

import com.project.habit_management.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ChallengeRepo extends JpaRepository<Challenge, Long> {
    List<Challenge> findByUserId(Integer userId);

    @Query("""
    SELECT c
    FROM Challenge c
    WHERE LOWER(c.challengeName)
    LIKE LOWER(CONCAT('%', :searchInput, '%'))
    OR LOWER(c.description)
    LIKE LOWER(CONCAT('%', :searchInput, '%'))
    """)
    List<Challenge> findSearchedChallenges(String searchInput);
}
