package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.ArticleComment;

public record SingleCommentResponse(ArticleCommentResponse comment) {
    public SingleCommentResponse(ArticleComment articleComment) {
        this(new ArticleCommentResponse(articleComment));
    }
}
