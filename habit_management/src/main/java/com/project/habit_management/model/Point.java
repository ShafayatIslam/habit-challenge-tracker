package com.project.habit_management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "point")
@Data
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private Integer points;
}
