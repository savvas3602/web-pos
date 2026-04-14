package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.UserDTO;
import com.savvasad.apps.dto.UserSaveDto;
import com.savvasad.apps.entity.UserEntity;
import com.savvasad.apps.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void toDTOShouldMapEntityFieldsIncludingRole() {
        UserEntity entity = new UserEntity();
        entity.setId(10L);
        entity.setUsername("john");
        entity.setFullName("John Doe");
        entity.setEmail("john@email.com");
        entity.setPassword("secret");
        entity.setRole(UserRole.ADMIN);

        UserDTO dto = userMapper.toDTO(entity);

        assertThat(dto).isNotNull();
        assertThat(dto.id()).isEqualTo(10L);
        assertThat(dto.username()).isEqualTo("john");
        assertThat(dto.fullName()).isEqualTo("John Doe");
        assertThat(dto.email()).isEqualTo("john@email.com");
        assertThat(dto.role()).isEqualTo(UserRole.ADMIN);
        assertThat(dto.token()).isNull();
    }

    @Test
    void toEntityFromUserDTOShouldMapFieldsIncludingRole() {
        UserDTO dto = new UserDTO(
                20L,
                "maryj",
                "Mary Jane",
                "mary@email.com",
                UserRole.USER,
                "jwt-token"
        );

        UserEntity entity = userMapper.toEntity(dto);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isEqualTo(20L);
        assertThat(entity.getUsername()).isEqualTo("maryj");
        assertThat(entity.getFullName()).isEqualTo("Mary Jane");
        assertThat(entity.getEmail()).isEqualTo("mary@email.com");
        assertThat(entity.getRole()).isEqualTo(UserRole.USER);
        assertThat(entity.getPassword()).isNull();
    }

    @Test
    void toEntityFromUserSaveDtoShouldMapFieldsIncludingPasswordAndRole() {
        UserSaveDto dto = new UserSaveDto(
                "alex",
                "Alex Black",
                "alex@email.com",
                "pass123",
                UserRole.ADMIN
        );

        UserEntity entity = userMapper.toEntity(dto);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isNull();
        assertThat(entity.getUsername()).isEqualTo("alex");
        assertThat(entity.getFullName()).isEqualTo("Alex Black");
        assertThat(entity.getEmail()).isEqualTo("alex@email.com");
        assertThat(entity.getPassword()).isEqualTo("pass123");
        assertThat(entity.getRole()).isEqualTo(UserRole.ADMIN);
    }

    @Test
    void mapperShouldReturnNullWhenInputIsNull() {
        assertThat(userMapper.toDTO(null)).isNull();
        assertThat(userMapper.toEntity((UserDTO) null)).isNull();
        assertThat(userMapper.toEntity((UserSaveDto) null)).isNull();
    }
}
