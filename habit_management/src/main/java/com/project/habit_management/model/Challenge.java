package com.project.habit_management.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "challenges")
@Data
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "challenge_name", nullable = false)
    private String challengeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeType type; // public / private

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeStatus status; // active / ended

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToOne(
        mappedBy = "challenge",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private ChallengeSecurity security;

    @OneToMany(
            mappedBy = "challenge",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<UserChallenge> userChallenges;
}
