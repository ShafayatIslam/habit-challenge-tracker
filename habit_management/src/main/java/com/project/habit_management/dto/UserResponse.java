package com.project.habit_management.dto;

import com.project.habit_management.model.User;
import lombok.Getter;

@Getter
public class UserResponse {
    private Integer id;
    private String username;
    private String password;

    private UserResponse(){}

    public static UserResponse fromUser(User u){
        UserResponse response = new UserResponse();

        if(u != null){
            response.id = u.getId();
            response.username = u.getUsername();
            response.password = u.getPassword();
        }

        return response;
    }
}
