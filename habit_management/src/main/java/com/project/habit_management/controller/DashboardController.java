package com.project.habit_management.controller;

import com.project.habit_management.dto.HabitResponse;
import com.project.habit_management.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@CrossOrigin
public class DashboardController {
    private final HabitService habitService;
    private final ChallengeService challengeService;
    private final PointService pointService;
    private final UserService userService;
    private final UserChallengeService userChallengeService;

    public DashboardController(HabitService habitService, ChallengeService challengeService, PointService pointService, UserService userService, UserChallengeService userChallengeService) {
        this.habitService = habitService;
        this.challengeService = challengeService;
        this.pointService = pointService;
        this.userService = userService;
        this.userChallengeService = userChallengeService;
    }

    @GetMapping("/dashboard")
    public String dashboard(@RequestParam Integer userId, Model model) {
        List<HabitResponse> habits = habitService.getAllHabits();

        model.addAttribute("completedHabits",habits.stream()
                .filter(HabitResponse::isCompleted).limit(4).toList());

        model.addAttribute("pendingHabits",habits.stream()
                        .filter(h -> !h.isCompleted())
                        .limit(4)
                        .toList()
        );

        model.addAttribute("habitCount", habitService.getUserHabits(userId).size());
        model.addAttribute("challengeCount", userChallengeService.getAllUserChallenges(userId).size());
        model.addAttribute("habits", habitService.getUserHabits(userId));
        model.addAttribute("challenges", userChallengeService.getAllUserChallenges(userId));
        model.addAttribute("points", pointService.getUserPoint(userId).getPoints());
        return "dashboard/dashboard";
    }


}
