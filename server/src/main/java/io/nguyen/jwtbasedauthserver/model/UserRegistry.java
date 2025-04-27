package io.nguyen.jwtbasedauthserver.model;

public record UserRegistry(String email, String username, String password) {
    public UserRegistry {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email is null or blank");
        }
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("username is null or blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("password is null or blank");
        }
    }
}
