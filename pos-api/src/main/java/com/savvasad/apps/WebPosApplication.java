package com.savvasad.apps;

import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.enums.UserRole;
import com.savvasad.apps.service.UsersService;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@SpringBootApplication
public class WebPosApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebPosApplication.class, args);
    }
}

@Component
@Profile("dev")
class DevDataInitializer implements CommandLineRunner {
    private final DataSource dataSource;

    @Value("classpath:scripts/create-test-data.sql")
    private Resource testDataSql;

    public DevDataInitializer(DataSource dataSource, UsersService usersService) {
        this.dataSource = dataSource;
        usersService.save(new UserSaveDto(
                "admin",
                "Administrator",
                "admin@email.com",
                "admin",
                UserRole.USER
        ));
    }

    @Override
    public void run(String @NonNull ... args) {
        ResourceDatabasePopulator populator = new ResourceDatabasePopulator(testDataSql);
        populator.execute(dataSource);
    }
}
