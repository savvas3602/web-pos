package com.savvasad.apps.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "orderEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderProductEntity> orderProductEntities;

    @Column(name = "order_value", nullable = false)
    private double orderValue;

    public OrderEntity() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public OrderEntity(Set<OrderProductEntity> orderProductEntities) {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.orderProductEntities = orderProductEntities;
    }

    public Long getId() { return id; }
    public Set<OrderProductEntity> getOrderProducts() { return orderProductEntities; }
    public void setOrderProducts(Set<OrderProductEntity> orderProductEntities) { this.orderProductEntities = orderProductEntities; }
    public double getOrderValue() { return orderValue; }
    public void setOrderValue(double orderValue) { this.orderValue = orderValue; }
}
