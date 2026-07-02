package com.savvasad.apps.mapper;

import com.savvasad.apps.dto.OrderDto;
import com.savvasad.apps.dto.OrderItemDto;
import com.savvasad.apps.dto.OrderProductDto;
import com.savvasad.apps.dto.OrderResponseDto;
import com.savvasad.apps.entity.OrderEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderDto toDto(OrderEntity entity) {
        List<OrderProductDto> products = entity.getOrderProducts().stream()
                .map(op -> new OrderProductDto(op.getProduct().getId(), op.getQuantity()))
                .toList();

        return new OrderDto(
                entity.getId(),
                entity.getOrderValue(),
                products,
                entity.isTotalOverridden(),
                entity.getPaymentMethod().getId(),
                entity.getComments(),
                entity.getCreatedAt()
        );
    }

    public OrderResponseDto toResponseDto(OrderEntity entity) {
        List<OrderItemDto> items = entity.getOrderProducts().stream()
                .map(op -> new OrderItemDto(
                        op.getProduct().getName(),
                        op.getProduct().getRetailPrice(),
                        op.getQuantity()
                ))
                .toList();

        return new OrderResponseDto(
                entity.getId(),
                entity.getOrderValue(),
                entity.getPaymentMethod().getName(),
                items,
                entity.isTotalOverridden(),
                entity.getComments(),
                entity.getCreatedAt()
        );
    }
}
