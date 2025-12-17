package com.savvasad.apps.entity;

import com.savvasad.apps.entity.keys.OrderProductKey;
import jakarta.persistence.*;

@Entity
@Table(name = "orders_products")
public class OrderProductEntity extends BaseEntity {
    @EmbeddedId
    private OrderProductKey id;

    @MapsId("orderId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity orderEntity;

    @MapsId("productId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @Column(nullable = false)
    private int quantity;

    // Getters, setters, constructors
    public OrderProductEntity() {}
    public OrderProductEntity(OrderEntity orderEntity, ProductEntity product, int quantity) {
        this.orderEntity = orderEntity;
        this.product = product;
        this.quantity = quantity;
        this.id = new OrderProductKey(orderEntity.getId(), product.getId());
    }

    public OrderProductKey getId() { return id; }
    public void setId(OrderProductKey id) { this.id = id; }
    public OrderEntity getOrder() { return orderEntity; }
    public void setOrder(OrderEntity orderEntity) { this.orderEntity = orderEntity; }
    public ProductEntity getProduct() { return product; }
    public void setProduct(ProductEntity product) { this.product = product; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
