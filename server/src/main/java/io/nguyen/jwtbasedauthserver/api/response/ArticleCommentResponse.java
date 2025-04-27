package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.ArticleComment;

import java.time.LocalDateTime;

public record ArticleCommentResponse(
        int id,
        LocalDateTime createdAt,
        String body,
        ProfileResponse author) {

    public ArticleCommentResponse(ArticleComment articleComment) {
        this(
                articleComment.getId(),
                articleComment.getCreatedAt(),
                articleComment.getContent(),
                ProfileResponse.fromUnauthenticated(articleComment.getAuthor()));
    }

    public ArticleCommentResponse(ArticleComment articleComment, boolean following) {
        this(
                articleComment.getId(),
                articleComment.getCreatedAt(),
                articleComment.getContent(),
                ProfileResponse.from(articleComment.getAuthor(), following));
    }
}
