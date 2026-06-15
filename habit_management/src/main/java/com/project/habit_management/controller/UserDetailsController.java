package com.project.habit_management.controller;

import com.project.habit_management.dto.UserDetailsRequest;
import com.project.habit_management.dto.UserDetailsResponse;
import com.project.habit_management.service.PointService;
import com.project.habit_management.service.UserDetailsService;
import com.project.habit_management.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserDetailsController {

    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final PointService pointService;

    public UserDetailsController(UserService userService, UserDetailsService userDetailsService, PointService pointService) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.pointService = pointService;
    }

    @PostMapping("/registration")
    public ResponseEntity<String> registerUser(@RequestBody UserDetailsRequest request){
        Integer id = userService.register(request.getUsername(), request.getPassword());

        request.setUserId(id);
        userDetailsService.saveUserDetails(request);

        pointService.saveUserPoint(id);

        return ResponseEntity.status(HttpStatus.CREATED).body("Registration successfull.");
    }

    @GetMapping("/details/{userId}")
    public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable Integer userId){
        return ResponseEntity.status(HttpStatus.OK).body(userDetailsService.getUserDetails(userId));
    }
}
