package com.savvasad.apps.controller;

import com.savvasad.apps.dto.UserDTO;

import com.savvasad.apps.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UsersController {
    private final UserMapper userMapper;
    public UsersController(UsersService usersService) {
    public UsersController(UsersService usersService, UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<UserEntity> save(@RequestBody UserDTO user) {
        UserDTO savedUser = usersService.save(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedUser.id)
                .toUri();

        return ResponseEntity.created(location).body(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
        return usersService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
        return usersService.findAll();
        return usersService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usersService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

