package com.project.habit_management.controller;

import com.project.habit_management.dto.UserRequest;
import com.project.habit_management.dto.UserResponse;
import com.project.habit_management.model.User;
import com.project.habit_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping("/all")
    public List<UserResponse> getUsers(){
        return service.getUsers().stream().map(s -> UserResponse.fromUser(s)).toList();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest ur){
        return new ResponseEntity<>(UserResponse.fromUser(service.login(ur)), HttpStatus.FOUND);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id){
        service.deleteUser(id);

        return ResponseEntity.status(HttpStatus.OK).body("Deletion successful");
    }
}
