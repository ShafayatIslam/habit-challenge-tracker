package com.project.habit_management.service;

import com.project.habit_management.dto.UserDetailsRequest;
import com.project.habit_management.dto.UserDetailsResponse;
import com.project.habit_management.exception.UserNotFoundException;
import com.project.habit_management.model.UserDetails;
import com.project.habit_management.repository.UserDetailsRepo;
import com.project.habit_management.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsService {
    private final UserRepo userRepo;
    private final UserDetailsRepo detailsRepo;

    public UserDetailsService(UserRepo userRepo, UserDetailsRepo detailsRepo) {
        this.userRepo = userRepo;
        this.detailsRepo = detailsRepo;
    }

    public void saveUserDetails(UserDetailsRequest request){
        UserDetails details = UserDetailsRequest.toUserDetails(request);
        details.setUser(userRepo.findById(request.getUserId()).orElse(null));
        detailsRepo.save(details);
    }

    public UserDetailsResponse getUserDetails(Integer userId){
        return UserDetailsResponse.fromUserDetails(detailsRepo.findById(userId).orElseThrow(UserNotFoundException::new));
    }
}
