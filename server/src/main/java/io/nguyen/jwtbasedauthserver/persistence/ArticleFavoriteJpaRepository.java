package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleFavorite;
import io.nguyen.jwtbasedauthserver.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

interface ArticleFavoriteJpaRepository extends JpaRepository<ArticleFavorite, Integer> {
    int countByArticle(Article article);

    boolean existsByUserAndArticle(User user, Article article);

    void deleteByUserAndArticle(User user, Article article);
}
