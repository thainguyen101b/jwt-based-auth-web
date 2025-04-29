package io.nguyen.jwtbasedauthserver.model;

import java.util.Collection;
import java.util.Optional;

public interface ArticleRepository {
    Article save(Article article);

    Article save(Article article, Collection<Tag> tags);

    Page<Article> findAll(ArticleFacets facets);

    Optional<Article> findBySlug(String slug);

    Page<Article> findByAuthors(Collection<User> authors, ArticleFacets facets);

    ArticleDetails findArticleDetails(Article article);

    ArticleDetails findArticleDetails(User requester, Article article);

    void delete(Article article);

    boolean existsByTitle(String title);
}
