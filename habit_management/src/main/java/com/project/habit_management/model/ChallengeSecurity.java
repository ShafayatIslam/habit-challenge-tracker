package com.project.habit_management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "challenge_security")
@Data
public class ChallengeSecurity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(name = "unique_id", unique = true, nullable = false)
    private Integer uniqueId;

    private String pin;
}
