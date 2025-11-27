package com.savvasad.apps.controller;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.service.ProductTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for managing Product Types.
 */
@RestController
@RequestMapping("/product-types")
public class ProductTypeController {

    private static final Logger logger = LoggerFactory.getLogger(ProductTypeController.class);
    private final ProductTypeService productTypeService;

    public ProductTypeController(ProductTypeService productTypeService) {
        this.productTypeService = productTypeService;
    }

    /**
     * Create a new Product Type.
     * @param dto the product type data
     * @return the created ProductTypeDTO
     */
    @PostMapping
    public ResponseEntity<ProductTypeDTO> create(@Valid @RequestBody ProductTypeDTO dto) {
        logger.info("Received request to create ProductType: name={}, description={}", dto.name(), dto.description());

        ProductTypeDTO created = productTypeService.save(dto);
        logger.info("Successfully created ProductType with id={}", created.id());

        return ResponseEntity.ok(created);
    }

    /**
     * Get a Product Type by its ID.
     * @param id the product type ID
     * @return the ProductTypeDTO if found, 404 otherwise
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductTypeDTO> getById(@PathVariable Long id) {
        logger.info("Received request to get ProductType by id={}", id);

        return productTypeService.findById(id)
                .map(dto -> {
                    logger.info("Found ProductType with id={}", id);
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> {
                    logger.warn("ProductType with id={} not found", id);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Get all Product Types.
     * @return list of ProductTypeDTOs
     */
    @GetMapping
    public List<ProductTypeDTO> getAll() {
        logger.info("Received request to get all ProductTypes");

        List<ProductTypeDTO> list = productTypeService.findAll();

        logger.info("Returning {} ProductTypes", list.size());
        return list;
    }

    /**
     * Update a Product Type by its ID.
     * @param id the product type ID
     * @param dto the updated product type data
     * @return the updated ProductTypeDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductTypeDTO> update(@PathVariable Long id, @Valid @RequestBody ProductTypeDTO dto) {
        logger.info("Received request to update ProductType id={}", id);

        ProductTypeDTO updated = productTypeService.update(id, dto);
        logger.info("Successfully updated ProductType with id={}", id);

        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a Product Type by its ID.
     * @param id the product type ID
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("Received request to delete ProductType id={}", id);

        productTypeService.deleteById(id);
        logger.info("Successfully deleted ProductType with id={}", id);

        return ResponseEntity.noContent().build();
    }
}
