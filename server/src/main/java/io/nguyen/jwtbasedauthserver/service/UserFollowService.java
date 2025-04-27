package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.model.User;
import io.nguyen.jwtbasedauthserver.model.UserFollow;
import io.nguyen.jwtbasedauthserver.model.UserFollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFollowService {
    private final UserFollowRepository userFollowRepository;

    /**
     * Check if the follower is following the following.
     *
     * @return Returns true if already following
     */
    public boolean isFollowing(User follower, User following) {
        return userFollowRepository.existsBy(follower, following);
    }

    /** Follow user. */
    public void follow(User follower, User following) {
        if (isFollowing(follower, following)) {
            return;
        }
        userFollowRepository.save(new UserFollow(follower, following));
    }

    /** Unfollow user. */
    public void unfollow(User follower, User following) {
        if (isFollowing(follower, following)) {
            userFollowRepository.deleteBy(follower, following);
        }
    }

}
