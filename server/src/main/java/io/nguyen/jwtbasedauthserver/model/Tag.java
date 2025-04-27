package io.nguyen.jwtbasedauthserver.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@Table(name = "tag")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuppressWarnings("JpaDataSourceORMInspection")
public class Tag {
    @Id
    @Column(length = 20)
    private String name;

    @Column(nullable = false, updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    public Tag(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is null or blank");
        }
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Tag other && Objects.equals(this.getName(), other.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getName());
    }
}
