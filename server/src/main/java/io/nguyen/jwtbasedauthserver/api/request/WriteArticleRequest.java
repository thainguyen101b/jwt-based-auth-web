package io.nguyen.jwtbasedauthserver.api.request;

import io.nguyen.jwtbasedauthserver.model.Tag;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public record WriteArticleRequest(Params article) {
    /**
     * Get the set of tags.
     * If tagList is null, returns an empty set to avoid null pointer exceptions.
     *
     * @return a Set of Tags. If tagList is null, an empty Set is returned instead of null.
     */
    public Set<Tag> tags() {
        return article.tagList == null ? Set.of() :
                article.tagList.stream()
                        .map(Tag::new)
                        .collect(Collectors.toSet());
    }

    public record Params(String title, String description, String body, List<String> tagList) {}
}
