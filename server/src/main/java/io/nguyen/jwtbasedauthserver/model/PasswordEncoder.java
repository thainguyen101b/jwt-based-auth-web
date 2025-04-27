package io.nguyen.jwtbasedauthserver.model;

public interface PasswordEncoder {
	boolean matches(String rawPassword, String encodedPassword);
	
	String encode(String rawPassword);
}
