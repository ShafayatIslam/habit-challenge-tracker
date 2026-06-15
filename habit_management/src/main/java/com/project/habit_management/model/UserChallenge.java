package com.project.habit_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "user_challenge")
@Data
public class UserChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer streak;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "last_completed")
    private LocalDate lastCompleted;
}
