package io.nguyen.jwtbasedauthserver.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@Table(name = "article_favorite", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"article_id", "user_id"})
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuppressWarnings("JpaDataSourceORMInspection")
public class ArticleFavorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    public ArticleFavorite(User user, Article article) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("user is null or unknown user.");
        }
        if (article == null || article.getId() == null) {
            throw new IllegalArgumentException("article is null or unknown article.");
        }

        this.article = article;
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof ArticleFavorite other
                && Objects.equals(this.getId(), other.getId())
                && Objects.equals(this.getUser(), other.getUser())
                && Objects.equals(this.getArticle(), other.getArticle());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId(), this.getUser(), this.getArticle());
    }

}
