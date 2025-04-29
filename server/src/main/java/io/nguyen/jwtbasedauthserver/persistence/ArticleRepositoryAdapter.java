package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
class ArticleRepositoryAdapter implements ArticleRepository {
    private final ArticleJpaRepository articleJpaRepository;
    private final TagJpaRepository tagJpaRepository;
    private final ArticleFavoriteJpaRepository articleFavoriteJpaRepository;

    @Override
    public Article save(Article article) {
        return articleJpaRepository.save(article);
    }

    @Override
    public Article save(Article article, Collection<Tag> tags) {
        var articleSaved = save(article);
        for (var tag : tagJpaRepository.saveAll(tags)) {
            articleSaved.addTag(new ArticleTag(articleSaved, tag));
        }

        return articleJpaRepository.save(articleSaved);
    }

    @Override
    public Page<Article> findAll(ArticleFacets facets) {
        var pageable = PageRequest.of(facets.page(), facets.size());
        var spec = Specification.where(ArticleSpecifications.hasAuthorName(facets.author()))
                .or(ArticleSpecifications.hasTagName(facets.tag()))
                .or(ArticleSpecifications.hasFavoritedUsername(facets.favorited()));

        org.springframework.data.domain.Page<Article> articlePage = articleJpaRepository.findAll(spec, pageable);
        return new Page<>(
                articlePage.getContent(),
                articlePage.getNumber(),
                articlePage.getSize(),
                articlePage.getTotalElements(),
                articlePage.getTotalPages());
    }

    @Override
    public Optional<Article> findBySlug(String slug) {
        return articleJpaRepository.findBySlug(slug);
    }

    @Override
    public Page<Article> findByAuthors(Collection<User> authors, ArticleFacets facets) {
        org.springframework.data.domain.Page<Article> articlePage =
                articleJpaRepository.findByAuthorIn(authors, PageRequest.of(facets.page(), facets.size()));
        return new Page<>(
                articlePage.getContent(),
                articlePage.getNumber(),
                articlePage.getSize(),
                articlePage.getTotalElements(),
                articlePage.getTotalPages());
    }

    @Override
    public ArticleDetails findArticleDetails(Article article) {
        int totalFavorites = articleFavoriteJpaRepository.countByArticle(article);

        return ArticleDetails.unauthenticated(article, totalFavorites);
    }

    @Override
    public ArticleDetails findArticleDetails(User requester, Article article) {
        int totalFavorites = articleFavoriteJpaRepository.countByArticle(article);
        boolean favorited = articleFavoriteJpaRepository.existsByUserAndArticle(requester, article);

        return new ArticleDetails(article, totalFavorites, favorited);
    }

    @Override
    public void delete(Article article) {
        articleJpaRepository.delete(article);
    }

    @Override
    public boolean existsByTitle(String title) {
        return articleJpaRepository.existsByTitle(title);
    }
}
