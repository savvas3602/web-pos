package com.savvasad.apps;

import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.service.UsersService;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class WebPosApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebPosApplication.class, args);
    }
}

@Component
@Profile("dev")
class DevDataInitializer implements CommandLineRunner {
    private final UsersService usersService;

    public DevDataInitializer(UsersService usersService) {
        this.usersService = usersService;
    }

    @Override
    public void run(String @NonNull ... args) {
        usersService.save(new UserSaveDto(
                "admin",
                "Administrator User",
                "admin@test.com",
                "admin"
        ));
    }
}
