package io.nguyen.jwtbasedauthserver.fixtures;

import io.nguyen.jwtbasedauthserver.model.Tag;

public final class TestTag extends Tag {
    @Override
    public String getName() {
        return "fixed tag name";
    }
}