package com.project.habit_management.controller;

import com.project.habit_management.dto.HabitRequest;
import com.project.habit_management.dto.HabitResponse;
import com.project.habit_management.service.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/habits")
public class HabitController {

    @Autowired
    private HabitService service;

    @GetMapping("/all")
    public List<HabitResponse> getAllHabits(){
        return service.getAllHabits();
    }

    @PostMapping("/creation")
    public ResponseEntity<String> addHabit(@RequestBody HabitRequest hr){
        service.addHabit(hr);
        return new ResponseEntity<>("Habit added successfully.", HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> addHabit(@PathVariable Integer id, @RequestBody HabitRequest request){
        service.updateHabit(id, request);
        return new ResponseEntity<>("Habit updated successfully.", HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteHabit(@PathVariable Integer id){
        service.deleteHabit(id);
        return new ResponseEntity<>("Habit deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<List<HabitResponse>> getUserHabits(@PathVariable int user_id){
        return new ResponseEntity<>(service.getUserHabits(user_id), HttpStatus.FOUND);
    }

    @GetMapping("/canComplete/{id}")
    public ResponseEntity<Boolean> canComplete(@PathVariable int id){
        return new ResponseEntity<>(service.canComplete(id), HttpStatus.OK);
    }

    @RequestMapping("/markComplete/{id}")
    public ResponseEntity<String> markComplete(@PathVariable int id){
        String msg = service.markComplete(id);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }
}
