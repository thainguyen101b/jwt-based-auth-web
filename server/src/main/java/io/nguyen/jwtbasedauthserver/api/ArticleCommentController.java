package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.request.WriteCommentRequest;
import io.nguyen.jwtbasedauthserver.api.response.ArticleCommentResponse;
import io.nguyen.jwtbasedauthserver.api.response.MultipleCommentsResponse;
import io.nguyen.jwtbasedauthserver.api.response.SingleCommentResponse;
import io.nguyen.jwtbasedauthserver.config.CustomAuthenticationToken;
import io.nguyen.jwtbasedauthserver.mixin.AuthenticationAwareMixin;
import io.nguyen.jwtbasedauthserver.model.ArticleComment;
import io.nguyen.jwtbasedauthserver.service.ArticleCommentService;
import io.nguyen.jwtbasedauthserver.service.ArticleService;
import io.nguyen.jwtbasedauthserver.service.UserFollowService;
import io.nguyen.jwtbasedauthserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
class ArticleCommentController implements AuthenticationAwareMixin {
    private final ArticleCommentService articleCommentService;
    private final ArticleService articleService;
    private final UserService userService;
    private final UserFollowService userFollowService;

    @PostMapping("/api/articles/{slug}/comments")
    SingleCommentResponse postComment(
            CustomAuthenticationToken commenterToken,
            @PathVariable String slug,
            @RequestBody WriteCommentRequest request) {
        var article = articleService.getArticle(slug);
        var commenter = userService.getUser(commenterToken.userId());
        var comment = articleCommentService.write(
                new ArticleComment(article, commenter, request.comment().body()));

        return new SingleCommentResponse(comment);
    }

    @GetMapping("/api/articles/{slug}/comments")
    MultipleCommentsResponse getComments(
            CustomAuthenticationToken readersToken,
            @PathVariable String slug) {
        var article = articleService.getArticle(slug);
        var comments = articleCommentService.getComments(article);

        if (this.isAnonymousUser(readersToken)) {
            return MultipleCommentsResponse.fromUnauthenticated(comments);
        }

        var reader = userService.getUser(readersToken.userId());
        return new MultipleCommentsResponse(comments.stream()
                .map(comment ->
                        new ArticleCommentResponse(comment, userFollowService.isFollowing(reader, comment.getAuthor())))
                .toList());
    }

    @SuppressWarnings("MVCPathVariableInspection")
    @DeleteMapping("/api/articles/{slug}/comments/{id}")
    void deleteComment(
            CustomAuthenticationToken commenterToken,
            @PathVariable("id") int commentId) {
        var commenter = userService.getUser(commenterToken.userId());
        var comment = articleCommentService.getComment(commentId);

        articleCommentService.delete(commenter, comment);
    }

}
