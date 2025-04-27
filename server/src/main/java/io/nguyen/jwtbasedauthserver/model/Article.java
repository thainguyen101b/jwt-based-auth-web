package io.nguyen.jwtbasedauthserver.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Getter
@Entity
@Table(name = "article")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuppressWarnings("JpaDataSourceORMInspection")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(length = 50, nullable = false, unique = true)
    private String slug;

    @Column(length = 50, nullable = false, unique = true)
    private String title;

    @Column(length = 50, nullable = false)
    private String description;

    @Column(length = 1_000, nullable = false)
    private String content;

    @OneToMany(mappedBy = "article", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private final Set<ArticleTag> articleTags = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    private static String titleToSlug(String title) {
        return title.toLowerCase().replaceAll("\\s+", "-");
    }

    public Article(User author, String title, String description, String content) {
        if (author == null || author.getId() == null) {
            throw new IllegalArgumentException("author is null or unknown author");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("title is null or blank");
        }
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("description is null or blank");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("content is null or blank");
        }

        this.author = author;
        this.title = title;
        this.slug = titleToSlug(title);
        this.description = description;
        this.content = content;
    }

    public void setTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("title is null or blank");
        }

        this.title = title;
        this.slug = titleToSlug(title);
        this.updatedAt = LocalDateTime.now();
    }

    public void setDescription(String description) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("description is null or blank");
        }

        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void setContent(String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("content is null or blank");
        }

        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public void addTag(ArticleTag tag) {
        articleTags.add(tag);
        tag.setArticle(this);
    }

    public boolean isNotAuthor(User author) {
        return !this.author.equals(author);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Article other && Objects.equals(this.getId(), other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId());
    }
}
