package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Article;
import io.nguyen.jwtbasedauthserver.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Collection;
import java.util.Optional;

interface ArticleJpaRepository extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {
    Optional<Article> findBySlug(String slug);

    Page<Article> findByAuthorIn(Collection<User> authors, Pageable pageable);

    boolean existsByTitle(String title);
}
