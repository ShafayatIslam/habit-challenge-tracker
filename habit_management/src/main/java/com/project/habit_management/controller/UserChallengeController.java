package com.project.habit_management.controller;

import com.project.habit_management.dto.ChallengeLeaderboardResponse;
import com.project.habit_management.dto.UserChallengeRequest;
import com.project.habit_management.dto.UserChallengeResponse;
import com.project.habit_management.service.UserChallengeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api")
public class UserChallengeController {

    final private UserChallengeService userChallengeService;

    public UserChallengeController(UserChallengeService userChallengeService) {
        this.userChallengeService = userChallengeService;
    }

    @PostMapping("/challenge/user/{userId}/{challengeId}")
    public ResponseEntity<String> joinChallenge(@PathVariable Integer userId,@PathVariable Long challengeId){
        userChallengeService.joinChallenge(userId, challengeId);
        return ResponseEntity.status(HttpStatus.OK).body("Joined challenge successfully.");
    }

    @GetMapping("/challenge/user/{userId}")
    public ResponseEntity<List<UserChallengeResponse>> getUserChallenges(@PathVariable Integer userId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.getAllUserChallenges(userId));
    }

    @GetMapping("/challenge/user/{userId}/{challengeId}")
    public ResponseEntity<UserChallengeResponse> getUserChallenge(@PathVariable Integer userId, @PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.getUserChallengeDetails(userId, challengeId));
    }

    @GetMapping("/challenge/user/can-complete/{userId}/{challengeId}")
    public ResponseEntity<Boolean> canComplete(@PathVariable Integer userId, @PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.canComplete(userId, challengeId));
    }

    @GetMapping("/challenge/user/mark-complete/{userId}/{challengeId}")
    public ResponseEntity<String> markComplete(@PathVariable Integer userId, @PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.markComplete(userId, challengeId));
    }

    @GetMapping("/challenge/total/participants/{challengeId}")
    public ResponseEntity<Long> countChallengeParticipants(@PathVariable Long challengeId){
        return  ResponseEntity.status(HttpStatus.OK).body(userChallengeService.countChallengeParticipants(challengeId));
    }

    @GetMapping("/challenge/user/can-join/{userId}/{challengeId}")
    public ResponseEntity<Boolean> canJoin(@PathVariable Integer userId, @PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.canJoin(userId, challengeId));
    }

    @GetMapping("/challenge/leaderboard/{challengeId}")
    public ResponseEntity<List<ChallengeLeaderboardResponse>> getChallengeLeaderboard(@PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.getChallengeLeaderboard(challengeId));
    }

    @DeleteMapping("/challenge/{userId}/{challengeId}")
    public ResponseEntity<String> leaveChallenge(@PathVariable Integer userId, @PathVariable Long challengeId){
        userChallengeService.leaveChallenge(userId, challengeId);
        return ResponseEntity.status(HttpStatus.OK).body("You have left this challenge successfully.");
    }

    @GetMapping("/challenge/total/{userId}")
    public ResponseEntity<Integer> countChallengeByUserId(@PathVariable Integer userId){
        return ResponseEntity.status(HttpStatus.OK).body(userChallengeService.countChallengeByUserId(userId));
    }
}
