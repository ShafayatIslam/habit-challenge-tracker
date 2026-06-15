package com.project.habit_management.dto;

import com.project.habit_management.model.Challenge;
import com.project.habit_management.model.ChallengeSecurity;
import com.project.habit_management.model.ChallengeType;
import lombok.Data;

@Data
public class ChallengeRequest {

    private Integer userId;
    private String challengeName;
    private String description;
    private ChallengeType type; // public / private
    private Integer durationDays;

    private Long challengeId;
    private Integer uniqueId;
    private String pin;

    public static Challenge toChallenge(ChallengeRequest request){
        Challenge challenge = new Challenge();

        challenge.setChallengeName(request.challengeName);
        challenge.setDescription(request.description);
        challenge.setType(request.type);
        challenge.setDurationDays(request.durationDays);

        return challenge;
    }

    public static ChallengeSecurity toChallengeSecurity(ChallengeRequest request){
        ChallengeSecurity security = new ChallengeSecurity();

        security.setUniqueId(request.uniqueId);
        security.setPin(request.pin);

        return security;
    }
}
