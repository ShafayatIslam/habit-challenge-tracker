package com.project.habit_management.dto;

import com.project.habit_management.model.Challenge;
import com.project.habit_management.model.User;
import com.project.habit_management.model.UserChallenge;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserChallengeRequest {

    private Long challengeId;
    private Integer userId;
    private Integer streak;

}
