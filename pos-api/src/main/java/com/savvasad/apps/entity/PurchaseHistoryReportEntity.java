package com.savvasad.apps.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rpt_purchase_history")
public class PurchaseHistoryReportEntity {
    @Id
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "order_value", precision = 10, scale = 2)
    private BigDecimal orderValue;

    @Column(name = "comments")
    private String comments;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "total_overridden")
    private Boolean totalOverridden;

    @Column(name = "total_items")
    private Integer totalItems;

    @Column(name = "items")
    private String items;

    public PurchaseHistoryReportEntity() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getOrderValue() {
        return orderValue;
    }

    public void setOrderValue(BigDecimal orderValue) {
        this.orderValue = orderValue;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Boolean getTotalOverridden() {
        return totalOverridden;
    }

    public void setTotalOverridden(Boolean totalOverridden) {
        this.totalOverridden = totalOverridden;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }
}

