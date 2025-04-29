package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final UserFollowRepository userFollowRepository;
    private final ArticleFavoriteRepository articleFavoriteRepository;

    /**
     * Get article by slug.
     *
     * @param slug article slug
     * @return Returns article
     */
    public Article getArticle(String slug) {
        return articleRepository.findBySlug(slug).orElseThrow(() -> new NoSuchElementException("article not found"));
    }

    /**
     * Get articles by facets.
     *
     * @param facets article facets
     * @return Returns articles with information
     */
    public Page<ArticleDetails> getArticles(ArticleFacets facets) {
        return articleRepository.findAll(facets)
                .map(articleRepository::findArticleDetails);
    }

    /**
     * Get articles by facets.
     *
     * @param requester user who requested
     * @param facets article facets
     * @return Returns articles with information
     */
    public Page<ArticleDetails> getArticles(User requester, ArticleFacets facets) {
        return articleRepository.findAll(facets)
                .map(article -> articleRepository.findArticleDetails(requester, article));
    }

    /**
     * Get articles by my followings.
     *
     * @param user user who requested
     * @param facets article facets
     * @return Returns articles with information
     */
    public Page<ArticleDetails> getFeeds(User user, ArticleFacets facets) {
        var followings = userFollowRepository.findByFollower(user).stream()
                .map(UserFollow::getFollowing)
                .toList();

        return articleRepository.findByAuthors(followings, facets)
                .map(article -> articleRepository.findArticleDetails(user, article));
    }

    /**
     * Write a new article.
     *
     * @param article article
     * @param tags tags
     * @return Returns the written article
     */
    public Article write(Article article, Collection<Tag> tags) {
        if (articleRepository.existsByTitle(article.getTitle())) {
            throw new IllegalArgumentException("title already exists");
        }

        return articleRepository.save(article, Objects.requireNonNullElseGet(tags, Set::of));
    }

    /**
     * Edit article title.
     *
     * @param requester user who requested
     * @param article article
     * @param title new title
     * @return Returns the edited article
     */
    public Article editTitle(User requester, Article article, String title) {
        if (article.isNotAuthor(requester)) {
            throw new IllegalArgumentException("you can't edit articles written by others.");
        }
        if (articleRepository.existsByTitle(title)) {
            throw new IllegalArgumentException("title already exists");
        }

        article.setTitle(title);
        return articleRepository.save(article);
    }

    /**
     * Edit article description.
     *
     * @param requester user who requested
     * @param article article
     * @param description new description
     * @return Returns the edited article
     */
    public Article editDescription(User requester, Article article, String description) {
        if (article.isNotAuthor(requester)) {
            throw new IllegalArgumentException("you can't edit articles written by others.");
        }

        article.setDescription(description);
        return articleRepository.save(article);
    }

    /**
     * Edit article content.
     *
     * @param requester user who requested
     * @param article article
     * @param content new content
     * @return Returns the edited article
     */
    public Article editContent(User requester, Article article, String content) {
        if (article.isNotAuthor(requester)) {
            throw new IllegalArgumentException("you can't edit articles written by others.");
        }

        article.setContent(content);
        return articleRepository.save(article);
    }

    /**
     * Delete article.
     * @param requester user who requested
     * @param article article
     */
    public void delete(User requester, Article article) {
        if (article.isNotAuthor(requester)) {
            throw new IllegalArgumentException("you can't delete articles written by others.");
        }

        articleRepository.delete(article);
    }

    /**
     * Check if the requester has favorited the article.
     *
     * @param requester user who requested
     * @param article article
     * @return Returns true if already favorited
     */
    public boolean isFavorite(User requester, Article article) {
        return articleFavoriteRepository.existsBy(requester, article);
    }

    /**
     * Favorite article.
     * @param requester user who requested
     * @param article article
     */
    public void favorite(User requester, Article article) {
        if (this.isFavorite(requester, article)) {
            throw new IllegalArgumentException("you already favorited this article.");
        }

        articleFavoriteRepository.save(new ArticleFavorite(requester, article));
    }

    /**
     * Unfavorite article.
     *
     * @param requester user who requested
     * @param article article
     */
    public void unfavorite(User requester, Article article) {
        if (!this.isFavorite(requester, article)) {
            throw new IllegalArgumentException("you already unfavorited this article.");
        }

        articleFavoriteRepository.deleteBy(requester, article);
    }

    /**
     * Get article details for anonymous users
     *
     * @param article article
     * @return Returns article details
     */
    public ArticleDetails getArticleDetails(Article article) {
        return articleRepository.findArticleDetails(article);
    }

    /**
     * Get article details for user.
     *
     * @param requester user who requested
     * @param article article
     * @return Returns article details
     */
    public ArticleDetails getArticleDetails(User requester, Article article) {
        return articleRepository.findArticleDetails(requester, article);
    }

}
