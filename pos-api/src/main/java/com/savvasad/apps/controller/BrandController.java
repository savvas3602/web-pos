package com.savvasad.apps.controller;

import com.savvasad.apps.dto.BrandDTO;
import com.savvasad.apps.service.BrandService;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * REST controller for managing Brands.
 * <p>
 * Provides endpoints for CRUD operations on brands.
 * <ul>
 *   <li><b>POST /brands</b>: Create a new brand. Returns 201 Created and the created BrandDTO in the response body.</li>
 *   <li><b>GET /brands/{id}</b>: Retrieve a brand by its ID. Returns 200 OK and the BrandDTO if found, or 404 Not Found if not.</li>
 *   <li><b>GET /brands</b>: Retrieve all brands. Returns 200 OK and a list of BrandDTOs.</li>
 *   <li><b>PUT /brands/{id}</b>: Update a brand by its ID. Returns 200 OK and the updated BrandDTO.</li>
 *   <li><b>DELETE /brands/{id}</b>: Delete a brand by its ID. Returns 204 No Content.</li>
 * </ul>
 * <p>
 * All request bodies are validated using Jakarta Bean Validation annotations.
 */
@RestController
@RequestMapping("/brands")
@PreAuthorize("hasRole('ROLE_USER')")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    /**
     * Retrieve a brand by its ID.
     * @param id the brand ID
     * @return HTTP 200 OK with BrandDTO if found, 404 if not
     */
    @GetMapping("/{id}")
    public ResponseEntity<@NonNull BrandDTO> getById(@PathVariable Long id) {
        return brandService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update a brand by its ID.
     * @param id the brand ID
     * @param brandDTO the updated brand data (validated)
     * @return HTTP 200 OK with the updated BrandDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<@NonNull BrandDTO> update(@PathVariable Long id, @Valid @RequestBody BrandDTO brandDTO) {
        return ResponseEntity.ok(brandService.update(id, brandDTO));
    }

    /**
     * Delete a brand by its ID.
     * @param id the brand ID
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> delete(@PathVariable Long id) {
        brandService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Create a new brand.
     * @param brandDTO the brand data (validated)
     * @return HTTP 201 Created with the created BrandDTO in the body and Location header
     */
    @PostMapping
    public ResponseEntity<@NonNull BrandDTO> save(@Valid @RequestBody BrandDTO brandDTO) {
        BrandDTO savedBrand = brandService.save(brandDTO);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedBrand.id())
                .toUri();
        return ResponseEntity.created(location).body(savedBrand);
    }

    /**
     * Retrieve all brands.
     * @return HTTP 200 OK with a list of BrandDTOs
     */
    @GetMapping
    public ResponseEntity<@NonNull List<BrandDTO>> getAll() {
        return ResponseEntity.ok(brandService.findAll());
    }
}
