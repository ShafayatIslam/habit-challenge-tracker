package com.project.habit_management.service;

import com.project.habit_management.dto.UserRequest;
import com.project.habit_management.exception.InvalidPasswordException;
import com.project.habit_management.exception.InvalidUsernameException;
import com.project.habit_management.model.User;
import com.project.habit_management.model.UserResponse;
import com.project.habit_management.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse login(UserRequest ur) throws InvalidUsernameException, InvalidPasswordException {
        User user = repo.findByUsername(ur.getUsername());
        if (user == null) {
            throw new InvalidUsernameException(ur.getUsername());
        }
        if (!passwordEncoder.matches(ur.getPassword(), user.getPassword())) {
            throw new InvalidUsernameException(ur.getUsername());
        }
        return UserResponse.fromUser(user);
    }
}
