package com.project.habit_management.repository;

import com.project.habit_management.model.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepo extends JpaRepository<UserDetails, Integer> {
}
