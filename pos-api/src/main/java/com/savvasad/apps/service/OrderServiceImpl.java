package com.savvasad.apps.service;

import com.savvasad.apps.dto.OrderDto;
import com.savvasad.apps.dto.OrderProductDto;
import com.savvasad.apps.dto.OrderResponseDto;
import com.savvasad.apps.entity.OrderEntity;
import com.savvasad.apps.entity.OrderProductEntity;
import com.savvasad.apps.entity.PaymentMethodEntity;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.mapper.OrderMapper;
import com.savvasad.apps.repository.OrderRepository;
import com.savvasad.apps.repository.PaymentMethodRepository;
import com.savvasad.apps.repository.ProductRepository;
import com.savvasad.apps.repository.OrderProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static java.util.Objects.isNull;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderProductRepository orderProductRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final OrderMapper orderMapper;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            OrderProductRepository orderProductRepository,
                            PaymentMethodRepository paymentMethodRepository,
                            OrderMapper orderMapper
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderProductRepository = orderProductRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.orderMapper = orderMapper;
    }

    // TODO: Add price validation and calculation logic, e.g. check if orderValue matches the sum of product prices, or if totalOverridden is true, then orderValue can be any value
    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto) {
        if (isNull(orderDto.products()) || orderDto.products().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one product");
        }

        PaymentMethodEntity paymentMethod = findPaymentMethodByIdOrThrow(orderDto.paymentMethodId());

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderValue(orderDto.orderValue());
        orderEntity.setTotalOverridden(orderDto.totalOverridden());
        orderEntity.setComments(orderDto.comments());
        orderEntity.setPaymentMethod(paymentMethod);
        orderEntity = orderRepository.save(orderEntity);

        for (OrderProductDto opDto : orderDto.products()) {
            ProductEntity product = findProductByIdOrThrow(opDto.productId());

            if (product.getStockQuantity() < opDto.quantity()) {
                throw new IllegalArgumentException(String.format(
                        "Not enough stock for product ID %s: | name: %s", product.getId(), product.getName())
                );
            }

            product.setStockQuantity(product.getStockQuantity() - opDto.quantity());
            productRepository.save(product);

            OrderProductEntity orderProductEntity = new OrderProductEntity(orderEntity, product, opDto.quantity());
            orderProductRepository.save(orderProductEntity);
        }

        return new OrderDto(
                orderEntity.getId(),
                orderEntity.getOrderValue(),
                orderDto.products(),
                orderEntity.isTotalOverridden(),
                orderEntity.getPaymentMethod().getId(),
                orderEntity.getComments(),
                orderEntity.getCreatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrderResponseDto> findById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> findAll() {
        return orderRepository.findAllOrderByCreatedAtDesc().stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByCreatedAtBetween(startDate, endDate).stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            EntityHelper.throwResourceNotFoundException("Order", id);
        }
        orderRepository.deleteById(id);
    }

    private ProductEntity findProductByIdOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("Product", id));
    }

    private PaymentMethodEntity findPaymentMethodByIdOrThrow(Long id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> EntityHelper.throwResourceNotFoundException("PaymentMethod", id));
    }
}
