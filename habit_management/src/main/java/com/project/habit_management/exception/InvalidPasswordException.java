package com.project.habit_management.exception;

public class InvalidPasswordException extends Exception{
    public InvalidPasswordException(String username) {
        super("Invalid password for user: " + username);
    }
}
