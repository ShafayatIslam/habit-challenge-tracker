package com.project.habit_management.service;

import com.project.habit_management.dto.ChallengeLeaderboardResponse;
import com.project.habit_management.dto.UserChallengeRequest;
import com.project.habit_management.dto.UserChallengeResponse;
import com.project.habit_management.exception.UserNotFoundException;
import com.project.habit_management.model.Challenge;
import com.project.habit_management.model.User;
import com.project.habit_management.model.UserChallenge;
import com.project.habit_management.repository.ChallengeRepo;
import com.project.habit_management.repository.UserChallengeRepo;
import com.project.habit_management.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserChallengeService {
    final private UserChallengeRepo userChallengeRepo;
    final private ChallengeRepo challengeRepo;
    final private UserRepo userRepo;
    final private PointService pointService;

    public UserChallengeService(UserChallengeRepo userChallengeRepo, ChallengeRepo challengeRepo, UserRepo userRepo, PointService pointService) {
        this.userChallengeRepo = userChallengeRepo;
        this.challengeRepo = challengeRepo;
        this.userRepo = userRepo;
        this.pointService = pointService;
    }

    public void joinChallenge(Integer userId, Long challengeId){
        if(userChallengeRepo.existsByUserIdAndChallengeId(userId, challengeId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already joined this challenge.");
        User user = userRepo.findById(userId).orElseThrow(() -> new UserNotFoundException());
        Challenge challenge = challengeRepo.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge Not Found!"));

        UserChallenge userChallenge = new UserChallenge();
        userChallenge.setUser(user);
        userChallenge.setChallenge(challenge);
        userChallenge.setStreak(0);
        LocalDate today = LocalDate.now();
        userChallenge.setJoiningDate(today);

        pointService.updateUserPoint(userId, 3);

        userChallengeRepo.save(userChallenge);
    }

    public List<UserChallengeResponse> getAllUserChallenges(Integer userId){
        if(!userRepo.existsById(userId))
            throw new UserNotFoundException();

        return userChallengeRepo.findAllChallengesByUserId(userId);
    }

    public UserChallengeResponse getUserChallengeDetails(Integer userId, Long challengeId){
        if(!userChallengeRepo.existsByUserIdAndChallengeId(userId, challengeId)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge details not found!");
        }

        return  userChallengeRepo.findAllChallengesByUserIdAndChallengeId(userId, challengeId);
    }

    public boolean canComplete(Integer userId, Long challengeId){
        if(!userRepo.existsById(userId))
            throw new UserNotFoundException();
        if(!userChallengeRepo.existsByUserIdAndChallengeId(userId, challengeId))
            throw new IllegalArgumentException("You have not joined this challenge yet.");

        UserChallenge userChallenge = userChallengeRepo.findByUserIdAndChallengeId(userId, challengeId);
        LocalDate today = LocalDate.now();

        if(userChallenge.getLastCompleted() == null) return true;
        return today.isAfter(userChallenge.getLastCompleted());
    }

    public String markComplete(Integer userId, Long challengeId){
        if(!canComplete(userId, challengeId))
            return "Challenge is already completed.";

        UserChallenge userChallenge = userChallengeRepo.findByUserIdAndChallengeId(userId, challengeId);
        LocalDate today = LocalDate.now();
        userChallenge.setLastCompleted(today);

        int streak = userChallenge.getStreak();
        userChallenge.setStreak(++streak);

        pointService.updateUserPoint(userId, 2);

        userChallengeRepo.save(userChallenge);
        return "Challenge is completed.";
    }

    public Long countChallengeParticipants(Long challengeId){
        return userChallengeRepo.countByChallengeId(challengeId);
    }

    public Boolean canJoin(Integer userId, Long challengeId){
        if(userChallengeRepo.existsByUserIdAndChallengeId(userId, challengeId)){
            return false;
        }

        return true;
    }

    public List<ChallengeLeaderboardResponse> getChallengeLeaderboard(Long challengeId){
        if(!userChallengeRepo.existsByChallengeId(challengeId))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Challenge Not Found!");

        return userChallengeRepo.findLeaderboardByChallengeId(challengeId);
    }

    public void leaveChallenge(Integer userId, Long challengeId){
        userChallengeRepo.deleteByUserIdAndChallengeId(userId, challengeId);
        pointService.updateUserPoint(userId, -3);
    }

    public Integer countChallengeByUserId(Integer userId){
        return userChallengeRepo.countByUserId(userId);
    }
}
