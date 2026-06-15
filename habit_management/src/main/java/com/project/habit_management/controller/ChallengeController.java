package com.project.habit_management.controller;

import com.project.habit_management.dto.ChallengeRequest;
import com.project.habit_management.dto.ChallengeResponse;
import com.project.habit_management.model.Challenge;
import com.project.habit_management.service.ChallengeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api")
public class ChallengeController {

    final private ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping("/challenge")
    public ResponseEntity<String> createChallenge(@RequestBody ChallengeRequest request){
        challengeService.createChallenge(request);
        return ResponseEntity.status(HttpStatus.OK).body("Challenge created successfully.");
    }

    @PutMapping("/challenge/{challengeId}")
    public ResponseEntity<String> updateChallenge(@PathVariable Long challengeId, @RequestBody ChallengeRequest request){
        challengeService.updateChallenge(challengeId, request);
        return ResponseEntity.status(HttpStatus.OK).body("Challenge updated successfully.");
    }

    @GetMapping("/challenge/all")
    public ResponseEntity<List<ChallengeResponse>> getALLChallenges(){
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getAllChallenges());
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<ChallengeResponse> getChallenge(@PathVariable Long challengeId){
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getChallenge(challengeId));
    }

    @GetMapping("/challenge/search/{searchInput}")
    public ResponseEntity<List<ChallengeResponse>> getSearchedChallenges(@PathVariable String searchInput){
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.getSearchedChallenges(searchInput));
    }

    @PostMapping("/challenge/can-join")
    public ResponseEntity<Boolean> canJoinPrivateChallenge(@RequestBody ChallengeRequest request){
        return ResponseEntity.status(HttpStatus.OK).body(challengeService.canJoinPrivateChallenge(request));
    }
}
