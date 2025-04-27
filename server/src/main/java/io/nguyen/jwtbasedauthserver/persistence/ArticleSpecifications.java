package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleFavorite;
import io.nguyen.jwtbasedauthserver.model.ArticleTag;
import io.nguyen.jwtbasedauthserver.model.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

final class ArticleSpecifications {
    // Suppresses default constructor, ensuring non-instantiability.
    private ArticleSpecifications() {}

    static Specification<Article> hasAuthorName(String authorName) {
        return (root, query, criteriaBuilder) -> {
            if (authorName == null || authorName.isBlank()) {
                return null;
            }
            Join<Article, User> articleUser = root.join("author", JoinType.INNER);
            return criteriaBuilder.equal(articleUser.get("username"), authorName);
        };
    }

    static Specification<Article> hasTagName(String tagName) {
        return (root, query, criteriaBuilder) -> {
            if (tagName == null || tagName.isBlank()) {
                return null;
            }

            Join<Article, ArticleTag> articleTags = root.join("articleTags", JoinType.LEFT);
            return criteriaBuilder.equal(articleTags.get("tag").get("name"), tagName);
        };
    }

    static Specification<Article> hasFavoritedUsername(String favoritedUsername) {
        return (root, query, criteriaBuilder) -> {
            if (query == null) {
                throw new IllegalArgumentException("query is null");
            }
            if (favoritedUsername == null || favoritedUsername.isBlank()) {
                return null;
            }

            Join<ArticleFavorite, User> favoriteUser =
                    query.from(ArticleFavorite.class).join("user", JoinType.LEFT);
            return criteriaBuilder.equal(favoriteUser.get("username"), favoritedUsername);
        };
    }

}
