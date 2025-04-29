package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.Page;

import java.util.List;

public record MultipleArticlesResponse(List<ArticleResponse> articles, int articlesCount, int pageNumber,
                                       int pageSize,
                                       long totalElements,
                                       int totalPages) {
    public MultipleArticlesResponse(Page<ArticleResponse> articleResponsePage) {
        this(
                articleResponsePage.content(),
                articleResponsePage.content().size(),
                articleResponsePage.pageNumber(),
                articleResponsePage.pageSize(),
                articleResponsePage.totalElements(),
                articleResponsePage.totalPages()
        );
    }

}
