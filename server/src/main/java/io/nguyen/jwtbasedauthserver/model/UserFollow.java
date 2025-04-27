package io.nguyen.jwtbasedauthserver.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Entity
@Table(name = "user_follow", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"follower_id", "following_id"})
})
@SuppressWarnings("JpaDataSourceORMInspection")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserFollow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;

    @Column(nullable = false, updatable = false)
    private final LocalDateTime createdAt = LocalDateTime.now();

    public UserFollow(User follower, User following) {
        if (follower == null || follower.getId() == null) {
            throw new IllegalArgumentException("follower is null or unknown user.");
        }
        if (following == null || following.getId() == null) {
            throw new IllegalArgumentException("following is null or unknown user.");
        }

        this.follower = follower;
        this.following = following;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof UserFollow other && Objects.equals(this.getId(), other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId());
    }
}
