package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.User;

public record ProfilesResponse(ProfileResponse profile) {
    public static ProfilesResponse fromUnauthenticated(User user) {
        return from(user, false);
    }

    public static ProfilesResponse from(User user, boolean following) {
        return new ProfilesResponse(ProfileResponse.from(user, following));
    }
}
