package com.project.habit_management.controller;

import com.project.habit_management.dto.UserRequest;
import com.project.habit_management.exception.InvalidPasswordException;
import com.project.habit_management.exception.InvalidUsernameException;
import com.project.habit_management.model.UserResponse;
import com.project.habit_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest url) throws InvalidPasswordException, InvalidUsernameException {
        return new ResponseEntity<>(userService.login(url), HttpStatus.OK);
    }
}
