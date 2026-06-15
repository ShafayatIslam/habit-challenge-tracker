package com.project.habit_management.model;

import com.project.habit_management.dto.HabitResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String description;
    private String frequency; //daily/weekly/monthly
    private String type;
    private int streak;

    @Column(
            name = "last_completed"
            //columnDefinition = "DATE DEFAULT (CURRENT_DATE)"  //SQL -> last_completed DATE DEFAULT (CURRENT_DATE)
    )
    private LocalDate lastCompleted;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
