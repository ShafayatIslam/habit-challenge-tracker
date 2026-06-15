package com.project.habit_management.controller;

import com.project.habit_management.dto.HabitResponse;
import com.project.habit_management.service.ChallengeService;
import com.project.habit_management.service.HabitService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class DashboardController {
    private final HabitService habitService;
    private final ChallengeService challengeService;

    public DashboardController(HabitService habitService, ChallengeService challengeService) {
        this.habitService = habitService;
        this.challengeService = challengeService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<HabitResponse> habits = habitService.getAllHabits();

        model.addAttribute("completedHabits",habits.stream().filter(HabitResponse::isCompleted).limit(4).toList());

        model.addAttribute("pendingHabits",habits.stream()
                        .filter(h -> !h.isCompleted())
                        .limit(4)
                        .toList()
        );
        model.addAttribute("habitCount", habitService.getAllHabits().size());
        model.addAttribute("challengeCount", challengeService.getAllChallenges().size());
        model.addAttribute("habits", habitService.getAllHabits());
        model.addAttribute("challenges", challengeService.getAllChallenges());
        return "dashboard/dashboard";
    }

}
