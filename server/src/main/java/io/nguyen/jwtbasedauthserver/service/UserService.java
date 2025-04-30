package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.model.PasswordEncoder;
import io.nguyen.jwtbasedauthserver.model.User;
import io.nguyen.jwtbasedauthserver.model.UserRegistry;
import io.nguyen.jwtbasedauthserver.model.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUser(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("user not found"));
    }

    public User getUser(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new NoSuchElementException("user not found"));
    }

    @SuppressWarnings("UnusedReturnValue")
    public User signup(UserRegistry registry) {
        if (userRepository.existsBy(registry.email(), registry.username())) {
            throw new IllegalArgumentException("email or username is already exists");
        }
        User requester = new User(registry);
        requester.encryptPassword(passwordEncoder, registry.password());
        return userRepository.save(requester);
    }

    public User login(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email is null or blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("password is null or blank");
        }

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("invalid email or password"));
    }

    public User updateUser(UUID userId, String email, String username, String password, String imageUrl) {
        if(userId == null) {
            throw new IllegalArgumentException("user id is required");
        }
        return userRepository.updateUserDetails(userId, passwordEncoder, email, username, password, imageUrl);
    }
}
