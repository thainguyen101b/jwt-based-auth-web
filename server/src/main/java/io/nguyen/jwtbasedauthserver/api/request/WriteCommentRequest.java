package io.nguyen.jwtbasedauthserver.api.request;

public record WriteCommentRequest(Params comment) {
    public record Params(String body) {}
}
