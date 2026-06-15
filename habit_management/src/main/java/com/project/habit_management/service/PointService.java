package com.project.habit_management.service;

import com.project.habit_management.model.Point;
import com.project.habit_management.model.User;
import com.project.habit_management.repository.PointRepo;
import com.project.habit_management.repository.UserRepo;
import org.springframework.stereotype.Service;

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
}
