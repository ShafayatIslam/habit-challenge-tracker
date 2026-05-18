package com.project.habit_management.exception;

public class InvalidUsernameException extends Exception{
    public InvalidUsernameException(String username) {
        super("Invalid username: " + username);
    }
}
