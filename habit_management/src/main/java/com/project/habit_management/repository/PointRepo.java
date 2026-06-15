package com.project.habit_management.repository;

import com.project.habit_management.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepo extends JpaRepository<Point, Long> {
}
