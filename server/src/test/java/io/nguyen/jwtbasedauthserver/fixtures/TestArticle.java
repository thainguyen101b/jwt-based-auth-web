package io.nguyen.jwtbasedauthserver.fixtures;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.User;

public final class TestArticle extends Article {
    private final Integer id;

    public TestArticle(Integer id, User author, String title, String description, String content) {
        super(author, title, description, content);
        this.id = id;
    }

    @Override
    public Integer getId() {
        return id;
    }
}