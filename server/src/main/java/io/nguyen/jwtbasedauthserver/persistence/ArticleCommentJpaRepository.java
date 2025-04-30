package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface ArticleCommentJpaRepository extends JpaRepository<ArticleComment, Integer> {
    List<ArticleComment> findByArticleOrderByCreatedAtDesc(Article article);

    void deleteByArticle(Article article);
}
