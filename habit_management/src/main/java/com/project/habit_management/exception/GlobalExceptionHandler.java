package com.project.habit_management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameConflictException.class)
    public ResponseEntity<ErrorResponse> handleUsernameConflict(UsernameConflictException ex){
        ErrorResponse response = new ErrorResponse(
                111,
                "Username Conflict",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UsernameConflictException ex){
        ErrorResponse response = new ErrorResponse(
                112,
                "User Not Found!",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
}
