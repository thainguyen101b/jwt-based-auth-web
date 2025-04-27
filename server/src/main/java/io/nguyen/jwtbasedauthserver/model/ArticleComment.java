package io.nguyen.jwtbasedauthserver.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@Table(name = "article_comment")
@SuppressWarnings("JpaDataSourceORMInspection")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ArticleComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @Column(length = 500, nullable = false)
    private String content;

    @Column(nullable = false, updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    public ArticleComment(Article article, User author, String content) {
        if (article == null || article.getId() == null) {
            throw new IllegalArgumentException("article is null or not saved article.");
        }
        if (author == null || author.getId() == null) {
            throw new IllegalArgumentException("author is null or unknown user.");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("content must not be null or blank.");
        }

        this.article = article;
        this.author = author;
        this.content = content;
    }

    public boolean isNotAuthor(User requester) {
        return !this.author.equals(requester);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof ArticleComment other && Objects.equals(this.getId(), other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId());
    }
}
