package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.ArticleDetails;

public record SingleArticleResponse(ArticleResponse article) {
    public SingleArticleResponse(ArticleDetails articleDetails) {
        this(new ArticleResponse(articleDetails));
    }
}
