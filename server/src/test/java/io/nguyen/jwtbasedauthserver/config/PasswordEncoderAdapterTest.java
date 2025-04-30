package io.nguyen.jwtbasedauthserver.config;

import io.nguyen.jwtbasedauthserver.model.PasswordEncoder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderAdapterTest {
    PasswordEncoder sut;

    @BeforeEach
    void setUp() {
        sut = new PasswordEncoderAdapter();
    }

    @Test
    void testMatchesMethodWithCorrectCredentials() {
        // given
        String rawPassword = "TestPassword";
        String encodedPassword = sut.encode(rawPassword);

        // when
        boolean result = sut.matches(rawPassword, encodedPassword);

        // then
        assertTrue(result);
    }

    @Test
    void testMatchesMethodWithIncorrectCredentials() {
        // given
        String encodedPassword = sut.encode("CorrectPassword");

        // when
        boolean result = sut.matches("WrongPassword", encodedPassword);

        // then
        assertFalse(result);
    }
}