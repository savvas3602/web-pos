package com.savvasad.apps.service;

import com.savvasad.apps.entity.UserEntity;
import java.util.List;
import java.util.Optional;

public interface UsersService {
    UserDTO save(UserDTO user);
    Optional<UserDTO> findById(Long id);
    Optional<UserEntity> findByUsername(String username);
    List<UserDTO> findAll();
    void deleteById(Long id);
}

