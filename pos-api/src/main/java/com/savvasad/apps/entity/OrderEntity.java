package com.savvasad.apps.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "orders")
public class OrderEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "orderEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderProductEntity> orderProductEntities;

    @Column(name = "order_value", nullable = false, precision = 19, scale = 2)
    private BigDecimal orderValue;

    @Column(name = "total_overridden", nullable = false)
    private boolean totalOverridden = false;

    @Column(name = "comments", length = 500)
    private String comments;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payment_method_id", nullable = false)
    private PaymentMethodEntity paymentMethod;

    public OrderEntity() {}

    public Long getId() { return id; }
    public Set<OrderProductEntity> getOrderProducts() { return orderProductEntities; }
    public BigDecimal getOrderValue() { return orderValue; }
    public void setOrderValue(BigDecimal orderValue) { this.orderValue = orderValue; }
    public boolean isTotalOverridden() { return totalOverridden; }
    public void setTotalOverridden(boolean totalOverridden) { this.totalOverridden = totalOverridden; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public PaymentMethodEntity getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethodEntity paymentMethod) { this.paymentMethod = paymentMethod; }
}
