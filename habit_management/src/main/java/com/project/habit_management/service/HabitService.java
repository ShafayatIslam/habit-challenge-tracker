package com.project.habit_management.service;

import com.project.habit_management.dto.HabitRequest;
import com.project.habit_management.dto.HabitResponse;
import com.project.habit_management.model.Habit;
import com.project.habit_management.repository.HabitRepo;
import com.project.habit_management.repository.UserRepo;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitService {
    private final HabitRepo repository;
    @Autowired
    private HabitRepo habitRepo;

    @Autowired
    private UserRepo userRepo;

    public HabitService(HabitRepo repository) {
        this.repository = repository;
    }

    public List<HabitResponse> getAllHabits(){
        return habitRepo.findAll().stream().map(HabitResponse::fromEntity).toList();
    }

    public List<HabitResponse> getUserHabits(int user_id){
        return habitRepo.findByUser_IdOrderByIdAsc(user_id).stream().map(h -> HabitResponse.fromEntity(h)).toList();
    }

    public void addHabit(HabitRequest hr){
        Habit habit = HabitRequest.toEntity(hr);
        habit.setUser(userRepo.findById(hr.getUserId()).orElse(null)); //UserRepo is used here to find user.

        habitRepo.save(habit);
    }

    public void updateHabit(Integer id, HabitRequest request){
        Habit habit = habitRepo.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Habit Not Found!!"));

        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setFrequency(request.getFrequency());
        habit.setType(request.getType());

        habitRepo.save(habit);
    }

    public void deleteHabit(Integer id){
        if(!habitRepo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Habit Not Found!!");
        }

        habitRepo.deleteById(id);
    }

    public boolean canComplete(int id){
        Habit habit = habitRepo.findById(id).orElse(null);
        if(habit == null) return false;

        LocalDate today = LocalDate.now();

        boolean canComplete = false;

        if(habit.getLastCompleted() == null){  //New habit
            canComplete = true;
        }else{
            switch (habit.getFrequency()){
                case "Daily":
                    canComplete = !habit.getLastCompleted().equals(today);
                    break;
                case "Weekly":
                    canComplete = today.isAfter(habit.getLastCompleted().plusWeeks(1))
                            || today.equals(habit.getLastCompleted().plusWeeks(1));
                    break;
                case "Monthly":
                    canComplete = today.isAfter(habit.getLastCompleted().plusMonths(1))
                            || today.equals(habit.getLastCompleted().plusMonths(1));
                    break;
            }
        }

        return canComplete;
    }

    public String markComplete(int id){
        Habit habit = habitRepo.findById(id).orElse(null);
        if(habit != null && canComplete(id)){
            LocalDate today = LocalDate.now();

            int streak = habit.getStreak();
            streak++;
            habit.setStreak(streak);
            habit.setLastCompleted(today);
            habitRepo.save(habit);

            return "Marked successfully.";
        }

        return "Already marked.";
    }
}
