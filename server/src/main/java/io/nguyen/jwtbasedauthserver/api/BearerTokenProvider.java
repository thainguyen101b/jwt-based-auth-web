package io.nguyen.jwtbasedauthserver.api;

import io.nguyen.jwtbasedauthserver.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
class BearerTokenProvider {
    private final JwtEncoder jwtEncoder;

    Jwt getToken(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("user is null or unknown user");
        }
        var now = Instant.now();
        return jwtEncoder.encode(JwtEncoderParameters.from(JwtClaimsSet.builder()
                .issuer("https://nguyen.io")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(604800)) // 7 Days
                .subject(user.getId().toString())
                .build()));
    }

}
