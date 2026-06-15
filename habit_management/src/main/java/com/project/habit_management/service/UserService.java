package com.project.habit_management.service;

import com.project.habit_management.dto.UserRequest;
import com.project.habit_management.exception.UserNotFoundException;
import com.project.habit_management.exception.UsernameConflictException;
import com.project.habit_management.model.User;
import com.project.habit_management.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public Integer register(String username, String password){
        if(repo.existsByUsername(username)){
            throw new UsernameConflictException(username);
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));

        return repo.save(user).getId();
    }

    public void deleteUser(Integer id){
        if(!repo.existsById(id)) throw new UserNotFoundException();

        repo.deleteById(id);
    }

    public List<User> getUsers(){
        return repo.findAll();
    }

    public User login(UserRequest ur){
        User user = repo.findByUsername(ur.getUsername());
        String password = ur.getPassword();

        if(user != null && passwordEncoder.matches(password, user.getPassword())){
            return user;
        }else return null;
    }
}
