package com.project.habit_management.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(){
        super("User not found!!");
    }
}
