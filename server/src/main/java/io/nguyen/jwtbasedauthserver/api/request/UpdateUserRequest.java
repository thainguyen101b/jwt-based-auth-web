package io.nguyen.jwtbasedauthserver.api.request;

public record UpdateUserRequest(Params user) {
    public record Params(String email, String username, String password, String image){}
}
