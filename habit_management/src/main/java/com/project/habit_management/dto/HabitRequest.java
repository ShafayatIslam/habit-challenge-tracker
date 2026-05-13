package com.project.habit_management.dto;

import com.project.habit_management.model.Habit;
import lombok.Data;

@Data
public class HabitRequest {
    private String name;
    private String description;
    private String frequency; //daily/weekly/monthly
    private String type;
    private int streak;
    private Integer userId;

    private HabitRequest(){}

    public static Habit toEntity(HabitRequest hr){
        Habit habit = new Habit();

        habit.setName(hr.name);
        habit.setDescription(hr.description);
        habit.setFrequency(hr.frequency);
        habit.setType(hr.type);
        habit.setStreak(hr.streak);

        return habit;
    }
}
