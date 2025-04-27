package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.User;

public record UsersResponse(UserResponse user) {
    public static UsersResponse from(User user, String token) {
        return new UsersResponse(new UserResponse(token, user.getEmail(), user.getUsername(), user.getImageUrl()));
    }
}
