package com.project.habit_management.service;

import com.project.habit_management.dto.ChallengeRequest;
import com.project.habit_management.dto.ChallengeResponse;
import com.project.habit_management.exception.UserNotFoundException;
import com.project.habit_management.model.*;
import com.project.habit_management.repository.ChallengeRepo;
import com.project.habit_management.repository.ChallengeSecurityRepo;
import com.project.habit_management.repository.UserChallengeRepo;
import com.project.habit_management.repository.UserRepo;
import lombok.Data;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ChallengeService {
    final private ChallengeRepo challengeRepo;
    final private UserRepo userRepo;
    final private ChallengeSecurityRepo securityRepo;
    final private UserChallengeRepo userChallengeRepo;
    final private PasswordEncoder passwordEncoder;
    final private PointService pointService;

    public ChallengeService(ChallengeRepo challengeRepo, UserRepo userRepo, ChallengeSecurityRepo securityRepo, UserChallengeRepo userChallengeRepo, PasswordEncoder passwordEncoder, PointService pointService) {
        this.challengeRepo = challengeRepo;
        this.userRepo = userRepo;
        this.securityRepo = securityRepo;
        this.userChallengeRepo = userChallengeRepo;
        this.passwordEncoder = passwordEncoder;
        this.pointService = pointService;
    }

    public void createChallenge(ChallengeRequest request){
        User user = userRepo.findById(request.getUserId()).orElseThrow(UserNotFoundException::new);

        if(request.getDurationDays() < 1)
            throw new IllegalArgumentException("Minimum duration of challenge must be 1 day.");
        if(securityRepo.existsByUniqueId(request.getUniqueId()))
            throw new IllegalArgumentException("This private challenge ID is already taken. Choose another one.");


        Challenge challenge = ChallengeRequest.toChallenge(request);
        challenge.setUser(user);
        challenge.setStatus(ChallengeStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(request.getDurationDays());
        challenge.setDurationDays(request.getDurationDays());
        challenge.setCreationDate(today);
        challenge.setEndDate(endDate);

        Challenge savedChallenge = challengeRepo.save(challenge);

        if(request.getType() == ChallengeType.PRIVATE){

            ChallengeSecurity security = ChallengeRequest.toChallengeSecurity(request);
            security.setPin(passwordEncoder.encode(request.getPin()));
            security.setChallenge(savedChallenge);

            securityRepo.save(security);
        }

        UserChallenge userChallenge = new UserChallenge();
        userChallenge.setUser(user);
        userChallenge.setChallenge(savedChallenge);
        userChallenge.setStreak(0);
        userChallenge.setJoiningDate(today);

        userChallengeRepo.save(userChallenge);

        pointService.updateUserPoint(request.getUserId(), 5);
    }

    public void updateChallenge(Long challengeId, ChallengeRequest request){
        Challenge challenge = challengeRepo.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge Not Found!"));
        User user = userRepo.findById(request.getUserId()).orElseThrow(UserNotFoundException::new);

        if(request.getDurationDays() < 1)
            throw new IllegalArgumentException("Minimum duration of challenge must be 1 day.");

        challenge.setChallengeName(request.getChallengeName());
        challenge.setDescription(request.getDescription());

        LocalDate creationDate = challenge.getCreationDate();
        LocalDate newEndDate = creationDate.plusDays(request.getDurationDays());
        challenge.setDurationDays(request.getDurationDays());
        challenge.setEndDate(newEndDate);

        if(challenge.getType() == ChallengeType.PRIVATE){
            ChallengeSecurity security = securityRepo.findByChallengeId(challenge.getId());
            security.setPin(request.getPin());

            securityRepo.save(security);
        }

        challengeRepo.save(challenge);
    }

    public List<ChallengeResponse> getAllChallenges(){
        return challengeRepo.findAll()
                .stream()
                .map(ChallengeResponse::fromChallenge)
                .toList();
    }

    public ChallengeResponse getChallenge(Long challengeId){
        Challenge challenge = challengeRepo.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge Not Found!"));
        return ChallengeResponse.fromChallenge(challenge);
    }

    public List<ChallengeResponse> getSearchedChallenges(String searchInput){
        return challengeRepo.findSearchedChallenges(searchInput).stream().map(ChallengeResponse::fromChallenge).toList();
    }

    public Boolean canJoinPrivateChallenge(ChallengeRequest request){
        if(!securityRepo.existsByUniqueIdAndChallengeId(request.getUniqueId(), request.getChallengeId()))
            throw new IllegalArgumentException("Invalid ID Or PIN.");

        ChallengeSecurity security = securityRepo.findByUniqueId(request.getUniqueId());
        return security != null && passwordEncoder.matches(request.getPin(), security.getPin());
    }
}
