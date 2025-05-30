package io.nguyen.jwtbasedauthserver.model;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuppressWarnings("JpaDataSourceORMInspection")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(length = 50, nullable = false, unique = true)
	private String username;
	
	@Column(length = 200, nullable = false)
	private String password;

	@Column(length = 200)
	private String imageUrl;
	
	@Column(nullable = false, updatable = false)
	private final LocalDateTime createdAt = LocalDateTime.now();

	public User(UserRegistry registry) {
		this(registry.email(), registry.username(), registry.password());
	}

	public User(String email, String username, String password) {
		if (email == null || email.isBlank()) {
			throw new IllegalArgumentException("email is null or blank");
		}
		if (username == null || username.isBlank()) {
			throw new IllegalArgumentException("username is null or blank");
		}
		if (password == null || password.isBlank()) {
			throw new IllegalArgumentException("password is null or blank");
		}
		
		this.email = email;
		this.username = username;
		this.password = password;
	}
	
	public void encryptPassword(PasswordEncoder passwordEncoder, String plainPassword) {
		if (passwordEncoder == null) {
			throw new IllegalArgumentException("passwordEncoder is required");
		}
		if (plainPassword == null || plainPassword.isBlank()) {
			log.warn("not set because the rawPassword is empty.");
			return;
		}
		if (passwordEncoder.matches(plainPassword, this.password)) {
			log.warn("not set because the rawPassword is same as current password.");
			return;
		}

		this.password = passwordEncoder.encode(plainPassword);
	}

	public boolean equalsEmail(String email) {
		return this.email.equals(email);
	}

	public boolean equalsUsername(String username) {
		return this.username.equals(username);
	}

	public void setEmail(String email) {
		if (email == null || email.isBlank() || this.email.equals(email)) {
			log.warn("not set because the email is empty or equals. email={}", email);
			return;
		}

		// Note: You can add some more validations here if you want. (ex. regex)
		this.email = email;
	}

	public void setUsername(String username) {
		if (username == null || username.isBlank() || this.username.equals(username)) {
			log.warn("not set because the username is empty or equals. username={}", username);
			return;
		}

		// Note: You can add some more validations here if you want. (ex. regex)
		this.username = username;
	}

	public void setImageUrl(String imageUrl) {
		if (imageUrl == null || imageUrl.isBlank()) {
			log.warn("not set because the imageUrl is empty. imageUrl={}", imageUrl);
			return;
		}

		this.imageUrl = imageUrl;
	}

	@Override
	public boolean equals(Object o) {
		return o instanceof User other && Objects.equals(this.getId(), other.getId());
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.getId());
	}
}
