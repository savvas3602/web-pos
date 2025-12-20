package com.savvasad.apps.service;

import com.savvasad.apps.dto.UserDTO;
import com.savvasad.apps.entity.UserEntity;
import com.savvasad.apps.mapper.UserMapper;
import com.savvasad.apps.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {
    private final UsersRepository usersRepository;
    private final UserMapper userMapper;

    public UsersServiceImpl(UsersRepository usersRepository, UserMapper userMapper) {
        this.usersRepository = usersRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDTO save(UserDTO user) {
        UserEntity userEntity = userMapper.toEntity(user);
        UserEntity savedUser = usersRepository.save(userEntity);
        return userMapper.toDTO(savedUser);
    }

    @Override
    public Optional<UserDTO> findById(Long id) {
        return usersRepository.findById(id).map(userMapper::toDTO);
    }

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    @Override
    public List<UserDTO> findAll() {
        return usersRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        usersRepository.deleteById(id);
    }
}

