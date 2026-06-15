package com.project.habit_management.repository;

import com.project.habit_management.model.ChallengeSecurity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeSecurityRepo extends JpaRepository<ChallengeSecurity, Long> {
    Boolean existsByUniqueId(Integer uniqueId);
    Boolean existsByUniqueIdAndChallengeId(Integer uniqueId, Long challengeId);
    ChallengeSecurity findByChallengeId(Long challengeId);
    ChallengeSecurity findByUniqueId(Integer uniqueId);
}
