package com.project.habit_management.dto;

import com.project.habit_management.model.Gender;
import com.project.habit_management.model.User;
import com.project.habit_management.model.UserDetails;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDetailsResponse {
    private Integer userId;
    private String fullName;
    private String email;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;
    private String bio;
    private Double rating;

    private UserDetailsResponse(){}

    public static UserDetailsResponse fromUserDetails(UserDetails details){
        UserDetailsResponse response = new UserDetailsResponse();

        response.userId = details.getUserId();
        response.fullName = details.getFullName();
        response.email = details.getEmail();
        response.gender = details.getGender();
        response.dateOfBirth = details.getDateOfBirth();
        response.address = details.getAddress();
        response.bio = details.getBio();

        return response;
    }
}
