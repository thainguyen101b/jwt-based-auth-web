package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.response.SingleArticleResponse;
import io.nguyen.jwtbasedauthserver.config.CustomAuthenticationToken;
import io.nguyen.jwtbasedauthserver.service.ArticleService;
import io.nguyen.jwtbasedauthserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
class ArticleFavoriteController {
    private final ArticleService articleService;
    private final UserService userService;

    @PostMapping("/api/articles/{slug}/favorite")
    SingleArticleResponse like(CustomAuthenticationToken readersToken, @PathVariable String slug) {
        var reader = userService.getUser(readersToken.userId());
        var article = articleService.getArticle(slug);

        articleService.favorite(reader, article);

        return new SingleArticleResponse(articleService.getArticleDetails(reader, article));
    }

    @DeleteMapping("/api/articles/{slug}/favorite")
    SingleArticleResponse unlike(CustomAuthenticationToken readersToken, @PathVariable String slug) {
        var reader = userService.getUser(readersToken.userId());
        var article = articleService.getArticle(slug);

        articleService.unfavorite(reader, article);

        return new SingleArticleResponse(articleService.getArticleDetails(reader, article));
    }

}
