package com.project.habit_management.dto;

import com.project.habit_management.model.Gender;
import com.project.habit_management.model.UserDetails;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDetailsRequest {
    private Integer userId;
    private String username;
    private String password;

    private String fullName;
    private String email;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String address;

    public static UserDetails toUserDetails(UserDetailsRequest request){
        UserDetails userDetails = new UserDetails();

        userDetails.setFullName(request.getFullName());
        userDetails.setEmail(request.getEmail());
        userDetails.setGender(request.getGender());
        userDetails.setDateOfBirth(request.getDateOfBirth());
        userDetails.setAddress(request.getAddress());

        return userDetails;
    }
}
