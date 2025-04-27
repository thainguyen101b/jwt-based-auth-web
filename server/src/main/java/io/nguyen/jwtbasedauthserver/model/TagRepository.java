package io.nguyen.jwtbasedauthserver.model;

import java.util.List;

public interface TagRepository {
    List<Tag> findAll();
}
