package com.kordiukov.bioreactor.server.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Slf4j
public class CorsConfig {
    @Bean
    public WebMvcConfigurer getCorsConfiguration() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins("*") // ? ("http://127.0.0.1:5500") allow domain for CORS
                        .maxAge(3600)
                        .allowCredentials(false)
                        .allowedMethods("POST", "GET", "OPTIONS", "DELETE", "PUT", "PATCH")
                        .allowedHeaders("origin", "Content-Type", "X-Requested-With", "X-File-Name", "x-mime-type",
                                "Accept-Encoding", "Authorization", "Content-Range", "Content-Disposition",
                                "Content-Description", "Access-Control-Request-Method", "Access-Control-Request-Headers");
            }
        };
    }
}