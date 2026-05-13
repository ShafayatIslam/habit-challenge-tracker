package com.project.habit_management.dto;

import com.project.habit_management.model.Habit;
import lombok.Data;

@Data
public class HabitResponse {
    private Integer id;
    private String name;
    private String description;
    private String frequency; //daily/weekly/monthly
    private String type;
    private int streak;
    private String lastCompleted;
    private Integer userId;
    private String username;

    private HabitResponse(){}

    public static HabitResponse fromEntity(Habit h){
        HabitResponse response = new HabitResponse();

        response.id = h.getId();
        response.name = h.getName();
        response.description = h.getDescription();
        response.frequency = h.getFrequency();
        response.type = h.getType();
        response.streak = h.getStreak();
        if(h.getLastCompleted() != null){
            response.lastCompleted = h.getLastCompleted().toString();
        }
        response.userId = h.getUser().getId();
        response.username = h.getUser().getUsername();

        return response;
    }
}
