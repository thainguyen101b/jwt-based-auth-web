package io.nguyen.jwtbasedauthserver.api.response;

import java.util.List;

public record MultipleArticlesResponse(List<ArticleResponse> articles, int articlesCount) {
    public MultipleArticlesResponse(List<ArticleResponse> articles) {
        this(articles, articles.size());
    }

}
