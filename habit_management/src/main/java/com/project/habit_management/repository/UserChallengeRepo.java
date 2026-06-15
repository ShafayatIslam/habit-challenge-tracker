package com.project.habit_management.repository;

import com.project.habit_management.dto.ChallengeLeaderboardResponse;
import com.project.habit_management.dto.UserChallengeResponse;
import com.project.habit_management.model.UserChallenge;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserChallengeRepo extends JpaRepository<UserChallenge, Long> {

    Boolean existsByUserIdAndChallengeId(Integer userId, Long challengeId);
    Boolean existsByChallengeId(Long challengeId);
    UserChallenge findByUserIdAndChallengeId(Integer userId, Long challengeId);
    Long countByChallengeId(Long challengeId);

    @Transactional
    void deleteByUserIdAndChallengeId(Integer userid, Long challengeId);

    @Query("""
    SELECT new 
    com.project.habit_management.dto.UserChallengeResponse(
        uc.id,
        c.id,
        uc.user.id,
        uc.streak,
        uc.joiningDate,
        uc.lastCompleted,
        c.user.id,
        c.challengeName,
        c.description,
        c.type,
        c.status,
        c.durationDays,
        c.creationDate,
        c.endDate
    )
    FROM UserChallenge uc
    JOIN uc.challenge c
    WHERE uc.user.id = :userId
    """)
    List<UserChallengeResponse> findAllChallengesByUserId(Integer userId);

    @Query("""
    SELECT new 
    com.project.habit_management.dto.UserChallengeResponse(
        uc.id,
        c.id,
        uc.user.id,
        uc.streak,
        uc.joiningDate,
        uc.lastCompleted,
        c.user.id,
        c.challengeName,
        c.description,
        c.type,
        c.status,
        c.durationDays,
        c.creationDate,
        c.endDate
    )
    FROM UserChallenge uc
    JOIN uc.challenge c
    WHERE uc.user.id = :userId
    AND c.id = :challengeId
    """)
    UserChallengeResponse findAllChallengesByUserIdAndChallengeId(Integer userId, Long challengeId);

    @Query("""
    SELECT new
    com.project.habit_management.dto.ChallengeLeaderboardResponse(
        u.username,
        ud.fullName,
        uc.streak
    )
    FROM UserChallenge uc
    JOIN uc.user u
    JOIN UserDetails ud
    ON ud.user = u
    WHERE uc.challenge.id = :challengeId
    ORDER BY uc.streak DESC
    """)
    List<ChallengeLeaderboardResponse> findLeaderboardByChallengeId(Long challengeId);
}
