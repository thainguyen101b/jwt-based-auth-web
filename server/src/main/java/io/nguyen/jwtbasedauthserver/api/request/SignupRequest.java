package io.nguyen.jwtbasedauthserver.api.request;

public record SignupRequest(Params user) {
    public record Params(String email, String username, String password){}
}
