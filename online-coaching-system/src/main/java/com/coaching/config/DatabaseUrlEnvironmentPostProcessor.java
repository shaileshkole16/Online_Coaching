package com.coaching.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Converts Render/Heroku DATABASE_URL values (postgresql://...) into Spring JDBC properties.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }
        if (databaseUrl.startsWith("jdbc:")) {
            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", databaseUrl);
            environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", props));
            return;
        }

        try {
            URI uri = URI.create(databaseUrl);
            String scheme = uri.getScheme();
            if (scheme == null) {
                return;
            }

            boolean postgres = scheme.startsWith("postgres");
            boolean mysql = scheme.startsWith("mysql");
            if (!postgres && !mysql) {
                return;
            }

            String userInfo = uri.getUserInfo();
            String username = null;
            String password = "";
            if (userInfo != null && !userInfo.isBlank()) {
                String[] parts = userInfo.split(":", 2);
                username = decode(parts[0]);
                if (parts.length > 1) {
                    password = decode(parts[1]);
                }
            }

            String database = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");
            int port = uri.getPort();
            String host = uri.getHost();
            String query = uri.getQuery();

            String jdbcUrl;
            if (postgres) {
                String portPart = port > 0 ? ":" + port : "";
                jdbcUrl = "jdbc:postgresql://" + host + portPart + "/" + database;
                if (query != null && !query.isBlank()) {
                    jdbcUrl += "?" + query;
                } else {
                    jdbcUrl += "?sslmode=require";
                }
            } else {
                String portPart = port > 0 ? ":" + port : ":3306";
                jdbcUrl = "jdbc:mysql://" + host + portPart + "/" + database
                        + "?useSSL=true&allowPublicKeyRetrieval=true";
            }

            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", jdbcUrl);
            if (username != null) {
                props.put("spring.datasource.username", username);
            }
            props.put("spring.datasource.password", password);
            environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", props));
        } catch (Exception ignored) {
            // Keep default local datasource configuration if parsing fails.
        }
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
