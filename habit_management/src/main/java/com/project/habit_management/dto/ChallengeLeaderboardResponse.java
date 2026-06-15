package com.project.habit_management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChallengeLeaderboardResponse {
    private String username;
    private String fullName;
    private Integer streak;
}
