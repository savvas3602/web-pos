package com.savvasad.apps.controller;

import com.savvasad.apps.dto.ProductTypeDTO;
import com.savvasad.apps.service.ProductTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;

/**
 * REST controller for managing Product Types.
 * <p>
 * Provides endpoints for CRUD operations on product types.
 * <ul>
 *   <li><b>POST /product-types</b>: Create a new product type. Returns 201 Created and the created ProductTypeDTO in the response body.</li>
 *   <li><b>GET /product-types/{id}</b>: Retrieve a product type by its ID. Returns 200 OK and the ProductTypeDTO if found, or 404 Not Found if not.</li>
 *   <li><b>GET /product-types</b>: Retrieve all product types. Returns 200 OK and a list of ProductTypeDTOs.</li>
 *   <li><b>PUT /product-types/{id}</b>: Update a product type by its ID. Returns 200 OK and the updated ProductTypeDTO.</li>
 *   <li><b>DELETE /product-types/{id}</b>: Delete a product type by its ID. Returns 204 No Content.</li>
 * </ul>
 * <p>
 * All request bodies are validated using Jakarta Bean Validation annotations.
 */
@RestController
@RequestMapping("/product-types")
public class ProductTypeController {
    private final ProductTypeService productTypeService;

    public ProductTypeController(ProductTypeService productTypeService) {
        this.productTypeService = productTypeService;
    }

    /**
     * Create a new product type.
     * @param dto the product type data (validated)
     * @return HTTP 201 Created with the created ProductTypeDTO in the body and Location header
     */
    @PostMapping
    public ResponseEntity<@NonNull ProductTypeDTO> create(@Valid @RequestBody ProductTypeDTO dto) {
        ProductTypeDTO created = productTypeService.save(dto);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    /**
     * Retrieve a product type by its ID.
     * @param id the product type ID
     * @return HTTP 200 OK with ProductTypeDTO if found <br/> HTTP 404 If not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<@NonNull ProductTypeDTO> getById(@PathVariable Long id) {
        return productTypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieve all product types.
     * @return HTTP 200 OK with a list of ProductTypeDTOs
     */
    @GetMapping
    public ResponseEntity<@NonNull List<ProductTypeDTO>> getAll() {
        return ResponseEntity.ok(productTypeService.findAll());
    }

    /**
     * Update a product type by its ID.
     * @param id the product type ID
     * @param dto the updated product type data (validated)
     * @return HTTP 200 OK with the updated ProductTypeDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<@NonNull ProductTypeDTO> update(@PathVariable Long id, @Valid @RequestBody ProductTypeDTO dto) {
        return ResponseEntity.ok(productTypeService.update(id, dto));
    }

    /**
     * Delete a product type by its ID.
     * @param id the product type ID
     * @return HTTP 204 No Content (body is empty)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> delete(@PathVariable Long id) {
        productTypeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
