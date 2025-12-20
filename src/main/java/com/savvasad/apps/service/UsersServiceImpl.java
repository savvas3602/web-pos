package com.savvasad.apps.service;

import com.savvasad.apps.dto.UserDTO;
import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.entity.UserEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.mapper.UserMapper;
import com.savvasad.apps.repository.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UsersServiceImpl(UserService userService, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO save(UserSaveDto user) {
        userExistsCheck(user.username(), user.email());

        UserEntity userEntity = userMapper.toEntity(user);
        userEntity.setPassword(passwordEncoder.encode(user.password()));

        return userMapper.toDTO(userService.save(userEntity));
    }

    @Override
    public Optional<UserDTO> findById(Long id) {
        return userService.findById(id).map(userMapper::toDTO);
    }

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        return userService.findByUsername(username);
    }

    @Override
    public List<UserDTO> findAll() {
        return userService.findAll().stream()
                .map(userMapper::toDTO)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        userService.deleteById(id);
    }

    private void userExistsCheck(String username, String email) {
        if (userService.findByUsername(username).isPresent()) {
            EntityHelper.throwUserExistsException("username", username);
        }

        if (userService.findByEmail(email).isPresent()) {
            EntityHelper.throwUserExistsException("email", email);
        }
    }
}

