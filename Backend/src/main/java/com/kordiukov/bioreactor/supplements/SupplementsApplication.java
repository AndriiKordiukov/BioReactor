package com.kordiukov.bioreactor.supplements;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SupplementsApplication {

    private static final Logger logger = LogManager.getLogger(SpringApplication.class);


    public static void main(String[] args) {
        SpringApplication.run(SupplementsApplication.class, args);
        logger.warn("Application started");
    }

}
