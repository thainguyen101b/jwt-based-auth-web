package io.nguyen.jwtbasedauthserver.service;

import io.nguyen.jwtbasedauthserver.model.Tag;
import io.nguyen.jwtbasedauthserver.model.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

}
