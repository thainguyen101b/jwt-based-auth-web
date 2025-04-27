package io.nguyen.jwtbasedauthserver.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.Transient;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.AbstractOAuth2TokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Transient
public final class CustomAuthenticationToken extends AbstractOAuth2TokenAuthenticationToken<Jwt> {
    private final JwtAuthenticationToken delegate;

    public CustomAuthenticationToken(Jwt jwt, JwtAuthenticationToken delegate) {
        super(jwt);
        this.delegate = delegate;
    }

    /**
     * Returns a JWT. It usually refers to a token string expressing with 'eyXXX.eyXXX.eyXXX' format.
     *
     * @return the token value as a String
     */
    public String getTokenValue() {
        return delegate.getToken().getTokenValue();
    }

    /**
     * Extract Subject from JWT. Here, Subject is the user ID in UUID format.
     *
     * @return the user ID as a UUID
     */
    public UUID userId() {
        return UUID.fromString(delegate.getName());
    }

    @Override
    public Map<String, Object> getTokenAttributes() {
        return delegate.getTokenAttributes();
    }

    @Override
    public Object getPrincipal() {
        return delegate.getPrincipal();
    }

    @Override
    public Object getCredentials() {
        return delegate.getCredentials();
    }

    @Override
    public void eraseCredentials() {
        delegate.eraseCredentials();
    }

    @Override
    public Object getDetails() {
        return delegate.getDetails();
    }

    @Override
    public void setDetails(Object details) {
        delegate.setDetails(details);
    }

    @Override
    public void setAuthenticated(boolean authenticated) {
        delegate.setAuthenticated(authenticated);
    }

    @Override
    public boolean isAuthenticated() {
        return delegate.isAuthenticated();
    }

    @Override
    public String getName() {
        return delegate.getName();
    }

    @Override
    public Collection<GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }
}
