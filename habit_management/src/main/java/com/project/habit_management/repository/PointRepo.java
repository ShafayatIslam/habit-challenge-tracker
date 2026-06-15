package com.project.habit_management.repository;

import com.project.habit_management.dto.LeaderBoardResponse;
import com.project.habit_management.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PointRepo extends JpaRepository<Point, Long> {
    Point findByUserId(Integer userId);
    Boolean existsByUserId(Integer userId);

    @Query("""
    SELECT new 
    com.project.habit_management.dto.LeaderBoardResponse(
        u.id,
        u.username,
        ud.fullName,
        p.points
    )
    FROM User u
    JOIN u.details ud
    JOIN u.point p
    ORDER BY p.points DESC
    """)
    List<LeaderBoardResponse> getLeaderBoardUsers();
}
