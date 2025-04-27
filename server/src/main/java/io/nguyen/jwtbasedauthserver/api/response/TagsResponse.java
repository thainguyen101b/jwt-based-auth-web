package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.Tag;

import java.util.Collection;

public record TagsResponse(String[] tags) {
    public TagsResponse(Collection<Tag> tags) {
        this(tags.stream().map(Tag::getName).toArray(String[]::new));
    }
}
