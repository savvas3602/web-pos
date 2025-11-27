package com.savvasad.apps.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal retailPrice;

    @Column(nullable = false)
    private BigDecimal wholesalePrice;

    @Column(nullable = false)
    private int stockQuantity;

    @Column
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_type_id")
    private ProductTypeEntity productType;

    public ProductEntity() {}

    public ProductEntity(Long id,
                         String name,
                         BigDecimal retailPrice,
                         BigDecimal wholesalePrice,
                         int stockQuantity,
                         String description,
                         ProductTypeEntity productType
    ) {
        this.id = id;
        this.name = name;
        this.retailPrice = retailPrice;
        this.wholesalePrice = wholesalePrice;
        this.stockQuantity = stockQuantity;
        this.description = description;
        this.productType = productType;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getRetailPrice() {
        return retailPrice;
    }

    public void setRetailPrice(BigDecimal price) {
        this.retailPrice = price;
    }

    public BigDecimal getWholesalePrice() {
        return wholesalePrice;
    }

    public void setWholesalePrice(BigDecimal wholeSalePrice) {
        this.wholesalePrice = wholeSalePrice;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProductTypeEntity getProductType() {
        return productType;
    }

    public void setProductType(ProductTypeEntity productType) {
        this.productType = productType;
    }
}