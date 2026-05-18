package com.project.habit_management.dto;

import com.project.habit_management.model.User;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;

    private UserRequest(){}

    public static User toUser(UserRequest ur) {
        User user = new User();
        user.setUsername(ur.username);
        user.setPassword(ur.password);
        return user;
    }
}
