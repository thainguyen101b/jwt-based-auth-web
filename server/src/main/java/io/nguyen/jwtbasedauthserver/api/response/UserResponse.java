package io.nguyen.jwtbasedauthserver.api.response;

public record UserResponse(String token, String email, String username, String image) {
}
