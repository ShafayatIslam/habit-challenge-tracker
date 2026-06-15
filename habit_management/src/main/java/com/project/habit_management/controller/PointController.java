package com.project.habit_management.controller;

import com.project.habit_management.dto.LeaderBoardResponse;
import com.project.habit_management.service.PointService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class PointController {

    final private PointService pointService;

    public PointController(PointService pointService) {
        this.pointService = pointService;
    }

    @GetMapping("/point/leaderboard")
    public ResponseEntity<List<LeaderBoardResponse>> getLeaderBoardUsers(){
        return ResponseEntity.status(HttpStatus.OK).body(pointService.getLeaderBoardUsers());
    }
}
