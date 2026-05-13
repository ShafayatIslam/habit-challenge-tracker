package com.project.habit_management.repository;

import com.project.habit_management.model.Habit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitRepo extends JpaRepository<Habit, Integer> {

    List<Habit> findByUserId(int id, Sort sort);
    List<Habit> findByUser_IdOrderByIdAsc(int id);
}
