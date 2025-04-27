package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.request.LoginUserRequest;
import io.nguyen.jwtbasedauthserver.api.request.SignupRequest;
import io.nguyen.jwtbasedauthserver.api.request.UpdateUserRequest;
import io.nguyen.jwtbasedauthserver.api.response.UsersResponse;
import io.nguyen.jwtbasedauthserver.config.CustomAuthenticationToken;
import io.nguyen.jwtbasedauthserver.model.User;
import io.nguyen.jwtbasedauthserver.model.UserRegistry;
import io.nguyen.jwtbasedauthserver.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import java.util.Map;

@RestController
@RequiredArgsConstructor
class UserController {
    private final UserService userService;
    private final BearerTokenProvider bearerTokenProvider;

    private static final String LOGIN_URL = "/api/users/login";

    @PostMapping("/api/users")
    ModelAndView signup(HttpServletRequest httpServletRequest, @RequestBody SignupRequest request) {
        var userRegistry = new UserRegistry(
                request.user().email(),
                request.user().username(),
                request.user().password()
        );

        userService.signup(userRegistry);

        // Redirect to login API to automatically login when signup is complete
        LoginUserRequest loginUserRequest = new LoginUserRequest(request.user().email(), request.user().password());
        httpServletRequest.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, HttpStatus.TEMPORARY_REDIRECT);

        return new ModelAndView("redirect:" + LOGIN_URL, "user", Map.of("user", loginUserRequest));
    }
    

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(path = LOGIN_URL)
    UsersResponse login(@RequestBody LoginUserRequest request) {
        var email = request.user().email();
        var password = request.user().password();

        var user = userService.login(email, password);
        var accessToken = bearerTokenProvider.getToken(user);
        return UsersResponse.from(user, accessToken.getTokenValue());
    }

    @GetMapping("/api/user")
    UsersResponse getUser(CustomAuthenticationToken actorsToken) {
        var actor = userService.getUser(actorsToken.userId());

        return UsersResponse.from(actor, actorsToken.getTokenValue());
    }

    @PutMapping("/api/users")
    UsersResponse updateUser(CustomAuthenticationToken actorsToken, @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(
                actorsToken.userId(),
                request.user().email(),
                request.user().username(),
                request.user().password(),
                request.user().image()
        );
        return UsersResponse.from(user, actorsToken.getTokenValue());
    }

}
