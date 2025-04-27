package io.nguyen.jwtbasedauthserver.api.response;

import io.nguyen.jwtbasedauthserver.model.ArticleComment;

import java.util.List;

public record MultipleCommentsResponse(List<ArticleCommentResponse> comments) {
    public static MultipleCommentsResponse fromUnauthenticated(List<ArticleComment> articleComments) {
        return new MultipleCommentsResponse(
                articleComments.stream().map(ArticleCommentResponse::new).toList());
    }
}
