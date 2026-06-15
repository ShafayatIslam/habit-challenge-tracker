package com.project.habit_management.exception;

public class UsernameConflictException extends RuntimeException{
    public UsernameConflictException(String username){
        super("Username: "+username+" already exits. Choose another one.");
    }
}
