package com.savvasad.apps.service;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.entity.ProductTypeEntity;
import com.savvasad.apps.mapper.ProductTypeMapper;
import com.savvasad.apps.repository.ProductTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductTypeServiceImplTest {
    @Mock
    private ProductTypeRepository productTypeRepository;

    @Mock
    private ProductTypeMapper productTypeMapper;

    @InjectMocks
    private ProductTypeServiceImpl productTypeService;

    @Test
    void testCreateAndGetProductType() {
        ProductTypeEntity entity = new ProductTypeEntity(1L, "Type1", "Desc1");
        when(productTypeRepository.save(any())).thenReturn(entity);
        when(productTypeRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productTypeMapper.toEntity(any())).thenReturn(entity);
        when(productTypeMapper.toDto(any())).thenReturn(new ProductTypeDTO(1L, "Type1", "Desc1"));

        ProductTypeDTO dto = new ProductTypeDTO(null, "Type1", "Desc1");
        ProductTypeDTO created = productTypeService.save(dto);

        assertThat(created.name()).isEqualTo("Type1");
        assertThat(created.description()).isEqualTo("Desc1");

        Optional<ProductTypeDTO> foundOpt = productTypeService.findById(1L);
        assertThat(foundOpt).isPresent();

        ProductTypeDTO found = foundOpt.get();
        assertThat(found.name()).isEqualTo("Type1");
    }

    @Test
    void testFindAll() {
        when(productTypeRepository.findAll()).thenReturn(List.of(
                new ProductTypeEntity(1L, "Type1", "Desc1"),
                new ProductTypeEntity(2L, "Type2", "Desc2")
        ));
        List<ProductTypeDTO> all = productTypeService.findAll();
        assertThat(all).hasSize(2);
    }

    @Test
    void testUpdate() {
        ProductTypeEntity entity = new ProductTypeEntity(1L, "Type1", "Desc1");
        when(productTypeRepository.findById(1L)).thenReturn(Optional.of(entity));
        when(productTypeRepository.save(any())).thenReturn(entity);
        when(productTypeMapper.toDto(any())).thenReturn(new ProductTypeDTO(1L, "Type1-upd", "Desc1-upd"));

        ProductTypeDTO dto = new ProductTypeDTO(1L, "Type1-upd", "Desc1-upd");
        ProductTypeDTO updated = productTypeService.update(1L, dto);

        assertThat(updated.name()).isEqualTo("Type1-upd");
    }

    @Test
    void testDeleteById() {
        when(productTypeRepository.existsById(1L)).thenReturn(true);

        productTypeService.deleteById(1L);
        verify(productTypeRepository, times(1)).deleteById(1L);
    }
}

