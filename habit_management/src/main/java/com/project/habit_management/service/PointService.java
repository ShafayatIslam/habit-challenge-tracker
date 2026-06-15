package com.project.habit_management.service;

import com.project.habit_management.dto.LeaderBoardResponse;
import com.project.habit_management.exception.UserNotFoundException;
import com.project.habit_management.model.Point;
import com.project.habit_management.model.User;
import com.project.habit_management.repository.PointRepo;
import com.project.habit_management.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PointService {

    final private UserRepo userRepo;
    final private PointRepo pointRepo;

    public PointService(UserRepo userRepo, PointRepo pointRepo) {
        this.userRepo = userRepo;
        this.pointRepo = pointRepo;
    }

    public void saveUserPoint(Integer userId){
        User user = userRepo.findById(userId).orElse(null);
        Point point = new Point();
        point.setUser(user);
        point.setPoints(0);
        pointRepo.save(point);
    }

    public void updateUserPoint(Integer userId, Integer point){
        if(!pointRepo.existsByUserId(userId))
            throw new UserNotFoundException();
        Point userPoint = pointRepo.findByUserId(userId);
        userPoint.setPoints(userPoint.getPoints() + point);
        pointRepo.save(userPoint);
    }

    public List<LeaderBoardResponse> getLeaderBoardUsers(){
        return pointRepo.getLeaderBoardUsers();
    }
}
