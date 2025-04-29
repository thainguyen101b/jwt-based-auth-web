package io.nguyen.jwtbasedauthserver.model;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public record Page<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages
) {

    public <R> Page<R> map(Function<? super T, ? extends R> mapper) {
        List<R> transformedContent = content.stream()
                .map(mapper)
                .collect(Collectors.toList());
        return new Page<>(
                transformedContent,
                this.pageNumber,
                this.pageSize,
                this.totalElements,
                this.totalPages
        );
    }

}
