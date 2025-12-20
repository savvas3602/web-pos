package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.UserDTO;
import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }

        return new UserDTO(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getFullName(),
                userEntity.getEmail(),
                null // Token is not stored in the entity
        );
    }

    public UserEntity toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userDTO.id());
        userEntity.setUsername(userDTO.username());
        userEntity.setFullName(userDTO.fullName());
        userEntity.setEmail(userDTO.email());

        return userEntity;
    }

    public UserEntity toEntity(UserSaveDto userDTO) {
        if (userDTO == null) {
            return null;
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userDTO.id());
        userEntity.setUsername(userDTO.username());
        userEntity.setPassword(userDTO.password());
        userEntity.setFullName(userDTO.fullName());
        userEntity.setEmail(userDTO.email());

        return userEntity;
    }
}

