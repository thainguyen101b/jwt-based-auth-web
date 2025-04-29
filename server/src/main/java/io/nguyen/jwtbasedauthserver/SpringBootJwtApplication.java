package io.nguyen.jwtbasedauthserver;

import io.nguyen.jwtbasedauthserver.model.*;
import io.nguyen.jwtbasedauthserver.service.ArticleService;
import io.nguyen.jwtbasedauthserver.service.UserService;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.*;

@Slf4j
@SpringBootApplication
public class SpringBootJwtApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootJwtApplication.class, args);
    }

    @Bean
    CommandLineRunner dataTest(ArticleService articleService, UserService userService) {
        return args -> {
            Faker faker = new Faker();
            Random random = new Random();

            userService.signup(new UserRegistry("nguyen@example.com", "nguyen", "secret"));

            List<User> authors = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                UserRegistry userRegistry = new UserRegistry(
                        faker.internet().emailAddress(),
                        faker.internet().username(),
                        faker.internet().password()
                );
                authors.add(userService.signup(userRegistry));
            }

            List<Tag> tags = new ArrayList<>(List.of(
                    new Tag("java"), new Tag("spring"),
                    new Tag("vue"), new Tag("devops"),
                    new Tag("docker"), new Tag("k8s"),
                    new Tag("security"), new Tag("frontend"),
                    new Tag("backend"), new Tag("testing")
            ));

            for (int i = 0; i < 1000; i++) {
                User author = authors.get(random.nextInt(authors.size()));

                Article article = new Article(
                        author,
                        faker.book().title() + " " + i,
                        faker.lorem().sentence(),
                        faker.lorem().paragraph(6)
                );

                List<Tag> randomTags = new ArrayList<>();
                Collections.shuffle(tags);
                for (int j = 0; j < random.nextInt(3) + 1; j++) {
                    randomTags.add(tags.get(j));
                }

                articleService.write(article, randomTags);
            }

            log.info("Seeded 1000 articles successfully.");
        };
    }

}
