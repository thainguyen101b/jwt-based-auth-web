package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.api.response.TagsResponse;
import io.nguyen.jwtbasedauthserver.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
class TagController {
    private final TagService tagService;

    @GetMapping("/api/tags")
    TagsResponse getAllTags() {
        return new TagsResponse(tagService.getAllTags());
    }
}
