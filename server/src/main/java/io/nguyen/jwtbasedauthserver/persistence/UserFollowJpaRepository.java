package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.User;
import io.nguyen.jwtbasedauthserver.model.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface UserFollowJpaRepository extends JpaRepository<UserFollow, Integer> {
    List<UserFollow> findByFollower(User follower);

    void deleteByFollowerAndFollowing(User follower, User following);

    boolean existsByFollowerAndFollowing(User follower, User following);
}
