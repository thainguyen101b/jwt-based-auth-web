package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleComment;
import io.nguyen.jwtbasedauthserver.model.ArticleCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
class ArticleCommentRepositoryAdapter implements ArticleCommentRepository {
    private final ArticleCommentJpaRepository articleCommentJpaRepository;

    @Override
    public ArticleComment save(ArticleComment articleComment) {
        return articleCommentJpaRepository.save(articleComment);
    }

    @Override
    public Optional<ArticleComment> findById(int commentId) {
        return articleCommentJpaRepository.findById(commentId);
    }

    @Override
    public List<ArticleComment> findByArticle(Article article) {
        return articleCommentJpaRepository.findByArticle(article);
    }

    @Override
    @Transactional
    public void delete(ArticleComment articleComment) {
        articleCommentJpaRepository.delete(articleComment);
    }
}
