package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.ArticleComment;
import io.nguyen.jwtbasedauthserver.model.ArticleCommentRepository;
import io.nguyen.jwtbasedauthserver.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ArticleCommentService {
    private final ArticleCommentRepository articleCommentRepository;

    /**
     * Get comment by id.
     *
     * @param commentId comment id
     * @return Returns comment
     */
    public ArticleComment getComment(int commentId) {
        return articleCommentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("comment not found"));
    }

    /**
     * Get all comments by article.
     *
     * @param article article
     * @return Returns all comments
     */
    public List<ArticleComment> getComments(Article article) {
        return articleCommentRepository.findByArticle(article);
    }

    /**
     * Write a comment.
     *
     * @param articleComment comment
     * @return Returns the written comment
     */
    public ArticleComment write(ArticleComment articleComment) {
        return articleCommentRepository.save(articleComment);
    }

    /**
     * Delete comment.
     *
     * @param requester user who requested
     * @param articleComment comment
     */
    public void delete(User requester, ArticleComment articleComment) {
        if (articleComment.isNotAuthor(requester)) {
            throw new IllegalArgumentException("you can't delete comments written by others.");
        }

        articleCommentRepository.delete(articleComment);
    }

}
