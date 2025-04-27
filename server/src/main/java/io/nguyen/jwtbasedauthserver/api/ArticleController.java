package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.request.EditArticleRequest;
import io.nguyen.jwtbasedauthserver.api.request.WriteArticleRequest;
import io.nguyen.jwtbasedauthserver.api.response.ArticleResponse;
import io.nguyen.jwtbasedauthserver.api.response.MultipleArticlesResponse;
import io.nguyen.jwtbasedauthserver.api.response.SingleArticleResponse;
import io.nguyen.jwtbasedauthserver.config.CustomAuthenticationToken;
import io.nguyen.jwtbasedauthserver.mixin.AuthenticationAwareMixin;
import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleDetails;
import io.nguyen.jwtbasedauthserver.model.ArticleFacets;
import io.nguyen.jwtbasedauthserver.service.ArticleService;
import io.nguyen.jwtbasedauthserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toList;

@RestController
@RequiredArgsConstructor
class ArticleController implements AuthenticationAwareMixin {
    private final ArticleService articleService;
    private final UserService userService;

    @PostMapping("/api/articles")
    SingleArticleResponse postArticle(CustomAuthenticationToken authorsToken, @RequestBody WriteArticleRequest request) {
        var author = userService.getUser(authorsToken.userId());
        var article = articleService.write(
                new Article(
                        author,
                        request.article().title(),
                        request.article().description(),
                        request.article().body()),
                request.tags()
        );

        var favoritesCount = 0;
        var favorited = false;
        return new SingleArticleResponse(new ArticleDetails(article, favoritesCount, favorited));
    }

    @GetMapping("/api/articles")
    MultipleArticlesResponse getArticles(CustomAuthenticationToken readersToken,
                                         @RequestParam(value = "tag", required = false) String tag,
                                         @RequestParam(value = "author", required = false) String author,
                                         @RequestParam(value = "favorited", required = false) String favorited,
                                         @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
                                         @RequestParam(value = "limit", required = false, defaultValue = "20") int limit) {
        var facets = new ArticleFacets(tag, author, favorited, offset, limit);

        if (isAnonymousUser(readersToken)) {
            return this.getArticlesResponse(articleService.getArticles(facets));
        }

        var reader = userService.getUser(readersToken.userId());
        return this.getArticlesResponse(articleService.getArticles(reader, facets));
    }

    @GetMapping("/api/articles/{slug}")
    SingleArticleResponse getArticle(CustomAuthenticationToken readersToken, @PathVariable String slug) {
        var article = articleService.getArticle(slug);

        if (isAnonymousUser(readersToken)) {
            return new SingleArticleResponse(articleService.getArticleDetails(article));
        }

        var reader = userService.getUser(readersToken.userId());
        return new SingleArticleResponse(articleService.getArticleDetails(reader, article));
    }

    @PutMapping("/api/articles/{slug}")
    SingleArticleResponse updateArticle(
            CustomAuthenticationToken authorsToken,
            @PathVariable String slug,
            @RequestBody EditArticleRequest request) {
        var author = userService.getUser(authorsToken.userId());
        var article = articleService.getArticle(slug);

        if (request.article().title() != null) {
            article = articleService.editTitle(author, article, request.article().title());
        }
        if (request.article().description() != null) {
            article = articleService.editDescription(author, article, request.article().description());
        }
        if (request.article().body() != null) {
            article = articleService.editContent(author, article, request.article().body());
        }

        return new SingleArticleResponse(articleService.getArticleDetails(author, article));
    }

    @DeleteMapping("/api/articles/{slug}")
    void deleteArticle(CustomAuthenticationToken authorsToken, @PathVariable String slug) {
        var author = userService.getUser(authorsToken.userId());
        var article = articleService.getArticle(slug);

        articleService.delete(author, article);
    }

    @GetMapping("/api/articles/feed")
    MultipleArticlesResponse getArticlesFeed(
            CustomAuthenticationToken readersToken,
            @RequestParam(value = "offset", required = false, defaultValue = "0") int offset,
            @RequestParam(value = "limit", required = false, defaultValue = "20") int limit) {
        var reader = userService.getUser(readersToken.userId());
        var facets = new ArticleFacets(offset, limit);
        var articleDetails = articleService.getFeeds(reader, facets);

        return this.getArticlesResponse(articleDetails);
    }

    private MultipleArticlesResponse getArticlesResponse(List<ArticleDetails> articles) {
        return articles.stream()
                .map(ArticleResponse::new)
                .collect(collectingAndThen(toList(), MultipleArticlesResponse::new));
    }

}
