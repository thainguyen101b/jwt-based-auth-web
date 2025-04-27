package io.nguyen.jwtbasedauthserver.persistence;

import io.nguyen.jwtbasedauthserver.model.Tag;
import io.nguyen.jwtbasedauthserver.model.TagRepository;
import io.nguyen.jwtbasedauthserver.persistence.config.CacheName;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
class TagRepositoryAdapter implements TagRepository {
    private final TagJpaRepository tagJpaRepository;

    @Override
    @Cacheable(value = CacheName.ALL_TAGS)
    public List<Tag> findAll() {
        return tagJpaRepository.findAll();
    }
}
