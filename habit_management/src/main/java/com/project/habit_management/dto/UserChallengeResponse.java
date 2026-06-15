package com.project.habit_management.dto;

import com.project.habit_management.model.ChallengeStatus;
import com.project.habit_management.model.ChallengeType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserChallengeResponse {
    private Long id;
    private Long challengeId;
    private Integer participantId;
    private Integer streak;
    private LocalDate joiningDate;
    private LocalDate lastCompleted;

    private Integer ownerId;
    private String challengeName;
    private String description;
    private ChallengeType type; // public / private
    private ChallengeStatus status; // active / ended
    private Integer durationDays;
    private LocalDate creationDate;
    private LocalDate endDate;

    public UserChallengeResponse(
            Long id,
            Long challengeId,
            Integer participantId,
            Integer streak,
            LocalDate joiningDate,
            LocalDate lastCompleted,
            Integer userId,
            String challengeName,
            String description,
            ChallengeType type,
            ChallengeStatus status,
            Integer durationDays,
            LocalDate creationDate,
            LocalDate endDate) {
        this.id = id;
        this.challengeId = challengeId;
        this.participantId = participantId;
        this.streak = streak;
        this.joiningDate = joiningDate;
        this.lastCompleted = lastCompleted;
        this.ownerId = userId;
        this.challengeName = challengeName;
        this.description = description;
        this.type = type;
        this.status = status;
        this.durationDays = durationDays;
        this.creationDate = creationDate;
        this.endDate = endDate;
    }
}
