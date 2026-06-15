package com.project.habit_management.dto;

import com.project.habit_management.model.Challenge;
import com.project.habit_management.model.ChallengeStatus;
import com.project.habit_management.model.ChallengeType;
import lombok.Data;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
public class ChallengeResponse {
    private Long id;
    private Integer userId;
    private String challengeName;
    private String description;
    private ChallengeType type; // public / private
    private ChallengeStatus status; // active / ended
    private Integer durationDays;
    private LocalDate creationDate;
    private LocalDate endDate;

    private ChallengeResponse(){}

    public static ChallengeResponse fromChallenge(Challenge challenge){
        ChallengeResponse response = new ChallengeResponse();

        response.id = challenge.getId();
        response.userId = challenge.getUser().getId();
        response.challengeName = challenge.getChallengeName();
        response.description = challenge.getDescription();
        response.type = challenge.getType();
        response.status = challenge.getStatus();
        response.durationDays = challenge.getDurationDays();
        response.creationDate = challenge.getCreationDate();
        response.endDate = challenge.getEndDate();

        return response;
    }

    public int getProgressPercentage() {

        if (creationDate == null || endDate == null) {
            return 0;
        }

        long totalDays = ChronoUnit.DAYS.between(
                creationDate,
                endDate
        );

        long passedDays = ChronoUnit.DAYS.between(
                creationDate,
                LocalDate.now()
        );

        if (passedDays < 0) return 0;
        if (passedDays > totalDays) return 100;

        return (int) ((passedDays * 100.0) / totalDays);
    }
}
