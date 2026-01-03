package com.savvasad.apps.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "brands")
public class BrandEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

//    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<ProductEntity> products;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
//    public Set<ProductEntity> getProducts() { return products; }
//    public void setProducts(Set<ProductEntity> products) { this.products = products; }
}
