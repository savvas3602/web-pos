package com.savvasad.apps.controller;

import com.savvasad.apps.dto.ProductDTO;
import com.savvasad.apps.service.ProductService;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * A REST controller that provides endpoints for product CRUD operations.
 * Validations are performed using Jakarta @Valid annotation on the ProductDTO bean to validate.
 * @author Savvas Adamou
 */
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<@NonNull ProductDTO> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<@NonNull ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.update(id, productDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<@NonNull ProductDTO> saveProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.save(productDTO);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedProduct.id())
                .toUri();

        return ResponseEntity.created(location).body(savedProduct);
    }

    @GetMapping
    public ResponseEntity<@NonNull List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }
}