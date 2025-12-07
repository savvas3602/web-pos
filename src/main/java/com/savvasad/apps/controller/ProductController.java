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
 * REST controller for managing Products.
 * <p>
 * Provides endpoints for CRUD operations on products.
 * <ul>
 *   <li><b>POST /products</b>: Create a new product. Returns 201 Created and the created ProductDTO in the response body.</li>
 *   <li><b>GET /products/{id}</b>: Retrieve a product by its ID. Returns 200 OK and the ProductDTO if found, or 404 Not Found if not.</li>
 *   <li><b>GET /products</b>: Retrieve all products. Returns 200 OK and a list of ProductDTOs.</li>
 *   <li><b>PUT /products/{id}</b>: Update a product by its ID. Returns 200 OK and the updated ProductDTO.</li>
 *   <li><b>DELETE /products/{id}</b>: Delete a product by its ID. Returns 204 No Content.</li>
 * </ul>
 * <p>
 * All request bodies are validated using Jakarta Bean Validation annotations.
 */
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Retrieve a product by its ID.
     * @param id the product ID
     * @return HTTP 200 OK with ProductDTO if found <br/> HTTP 404 If not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<@NonNull ProductDTO> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update a product by its ID.
     * @param id the product ID
     * @param productDTO the updated product data (validated)
     * @return HTTP 200 OK with the updated ProductDTO <br/> HTTP 404 If ProductType is not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<@NonNull ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.update(id, productDTO));
    }

    /**
     * Delete a product by its ID.
     * @param id the product ID
     * @return HTTP 204 No Content (body is empty) <br/> HTTP 404 If not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<@NonNull Void> deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Create a new product.
     * @param productDTO the product data (validated)
     * @return HTTP 201 Created with the created ProductDTO in the body and Location header
     * <br/> HTTP 404 If ProductType is not found
     */
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

    /**
     * Retrieve all products.
     * @return HTTP 200 OK with a list of ProductDTOs
     */
    @GetMapping
    public ResponseEntity<@NonNull List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }
}