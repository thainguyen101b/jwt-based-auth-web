package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleFavorite;
import io.nguyen.jwtbasedauthserver.model.ArticleFavoriteRepository;
import io.nguyen.jwtbasedauthserver.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
class ArticleFavoriteRepositoryAdapter implements ArticleFavoriteRepository {
    private final ArticleFavoriteJpaRepository articleFavoriteJpaRepository;

    @Override
    public void save(ArticleFavorite articleFavorite) {
        articleFavoriteJpaRepository.save(articleFavorite);
    }

    @Override
    @Transactional
    public void deleteBy(User user, Article article) {
        articleFavoriteJpaRepository.deleteByUserAndArticle(user, article);
    }

    @Override
    public boolean existsBy(User user, Article article) {
        return articleFavoriteJpaRepository.existsByUserAndArticle(user, article);
    }
}
