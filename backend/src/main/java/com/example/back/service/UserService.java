package com.example.back.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.back.entity.User;
import com.example.back.repository.UserRepository;

import com.example.back.security.JwtUtil;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User signup(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User updatedUser) {

        return userRepository.findById(id).map(user -> {

            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());

            return userRepository.save(user);

        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}