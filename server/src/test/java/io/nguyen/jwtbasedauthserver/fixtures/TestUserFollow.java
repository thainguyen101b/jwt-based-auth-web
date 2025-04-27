package io.nguyen.jwtbasedauthserver.fixtures;

import io.nguyen.jwtbasedauthserver.model.UserFollow;

public final class TestUserFollow extends UserFollow {
    @Override
    public Integer getId() {
        return 1;
    }
}