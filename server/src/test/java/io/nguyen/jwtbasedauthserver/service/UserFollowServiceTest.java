package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.fixtures.TestUser;
import io.nguyen.jwtbasedauthserver.model.User;
import io.nguyen.jwtbasedauthserver.model.UserFollow;
import io.nguyen.jwtbasedauthserver.model.UserFollowRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserFollowServiceTest {
    @InjectMocks
    UserFollowService sut;

    @Mock
    UserFollowRepository userFollowRepository;

    User follower;
    User following;

    @BeforeEach
    void setUp() {
        follower = new TestUser(UUID.randomUUID(), "follower@example.com", "Follower", "passfollower");
        following = new TestUser(UUID.randomUUID(), "following@example.com", "Following", "passfollowing");
    }

    @Test
    void testIsFollowing_following() {
        when(userFollowRepository.existsBy(follower, following)).thenReturn(true);
        assertTrue(sut.isFollowing(follower, following));
    }

    @Test
    void testIsFollowing_not_following() {
        when(userFollowRepository.existsBy(follower, following)).thenReturn(false);
        assertFalse(sut.isFollowing(follower, following));
    }

    @Test
    void testIsNotFollowing_following() {
        when(userFollowRepository.existsBy(follower, following)).thenReturn(true);
        assertTrue(sut.isFollowing(follower, following));
    }

    @Test
    void testIsNotFollowing_not_following() {
        when(userFollowRepository.existsBy(follower, following)).thenReturn(false);
        assertFalse(sut.isFollowing(follower, following));
    }

    @Test
    void testFollow_success() {
        // given
        when(userFollowRepository.existsBy(any(User.class), any(User.class))).thenReturn(false);
        doNothing().when(userFollowRepository).save(any(UserFollow.class));

        // when
        sut.follow(follower, following);

        // then
        verify(userFollowRepository, times(1)).save(any(UserFollow.class));
    }

    @Test
    void testFollow_alreadyFollowing() {
        // given
        when(userFollowRepository.existsBy(any(User.class), any(User.class))).thenReturn(true);

        // when
        sut.follow(follower, following);

        // then
        verify(userFollowRepository, times(0)).save(any(UserFollow.class));
    }

    @Test
    void testUnfollow_success() {
        // given
        when(userFollowRepository.existsBy(any(User.class), any(User.class))).thenReturn(true);
        doNothing().when(userFollowRepository).deleteBy(any(User.class), any(User.class));

        // when
        sut.unfollow(follower, following);

        // then
        verify(userFollowRepository, times(1)).deleteBy(any(User.class), any(User.class));
    }

    @Test
    void testUnfollow_notFollowing() {
        // given
        when(userFollowRepository.existsBy(any(User.class), any(User.class))).thenReturn(false);

        // when
        sut.unfollow(follower, following);

        // then
        verify(userFollowRepository, times(0)).deleteBy(any(User.class), any(User.class));
    }
}