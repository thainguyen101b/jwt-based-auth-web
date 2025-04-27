package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.User;

public record ProfileResponse(String username, String image, boolean following) {
    public static ProfileResponse fromUnauthenticated(User user) {
        return from(user, false);
    }

    public static ProfileResponse from(User user, boolean following) {
        return new ProfileResponse(user.getUsername(), user.getImageUrl(), following);
    }
}
