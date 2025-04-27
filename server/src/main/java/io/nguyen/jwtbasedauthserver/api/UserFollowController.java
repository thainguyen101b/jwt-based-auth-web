package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.response.ProfilesResponse;
import io.nguyen.jwtbasedauthserver.config.CustomAuthenticationToken;
import io.nguyen.jwtbasedauthserver.mixin.AuthenticationAwareMixin;
import io.nguyen.jwtbasedauthserver.service.UserFollowService;
import io.nguyen.jwtbasedauthserver.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
class UserFollowController implements AuthenticationAwareMixin {

    private final UserService userService;
    private final UserFollowService userFollowService;

    @GetMapping("/api/profiles/{username}")
    ProfilesResponse getUserProfile(
            CustomAuthenticationToken profileViewersToken,
            @PathVariable("username") String targetUsername) {
        var targetUser = userService.getUser(targetUsername);

        if (this.isAnonymousUser(profileViewersToken)) {
            return ProfilesResponse.fromUnauthenticated(targetUser);
        }

        var viewer = userService.getUser(profileViewersToken.userId());
        var isFollowing = userFollowService.isFollowing(viewer, targetUser);

        return ProfilesResponse.from(targetUser, isFollowing);
    }

    @PostMapping("/api/profiles/{username}/follow")
    ProfilesResponse follow(
            CustomAuthenticationToken followersToken,
            @PathVariable("username") String targetUsername) {
        var follower = userService.getUser(followersToken.userId());
        var following = userService.getUser(targetUsername);

        userFollowService.follow(follower, following);

        return ProfilesResponse.from(following, true);
    }

    @DeleteMapping("/api/profiles/{username}/follow")
    ProfilesResponse unfollow(
            CustomAuthenticationToken followersToken,
            @PathVariable("username") String targetUsername) {
        var follower = userService.getUser(followersToken.userId());
        var following = userService.getUser(targetUsername);

        userFollowService.unfollow(follower, following);

        return ProfilesResponse.from(following, false);
    }

}
