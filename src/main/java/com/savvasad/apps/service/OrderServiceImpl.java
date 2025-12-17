package com.savvasad.apps.service;

import com.savvasad.apps.dto.OrderDto;
import com.savvasad.apps.dto.OrderProductDto;
import com.savvasad.apps.entity.OrderEntity;
import com.savvasad.apps.entity.OrderProductEntity;
import com.savvasad.apps.entity.ProductEntity;
import com.savvasad.apps.helper.EntityHelper;
import com.savvasad.apps.repository.OrderRepository;
import com.savvasad.apps.repository.ProductRepository;
import com.savvasad.apps.repository.OrderProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static java.util.Objects.isNull;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderProductRepository orderProductRepository;

    public  OrderServiceImpl(OrderRepository orderRepository,
                             ProductRepository productRepository,
                             OrderProductRepository orderProductRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderProductRepository = orderProductRepository;
    }

    /* TODO: Order value should be calculated, not sent via request
       TODO: 500 is returned when there is not enough stock
     */
    @Override
    @Transactional
    public OrderDto save(OrderDto orderDto) {
        if (isNull(orderDto.products()) || orderDto.products().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one product");
        }

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderValue(orderDto.orderValue());
        orderEntity = orderRepository.save(orderEntity);

        for (OrderProductDto opDto : orderDto.products()) {
            ProductEntity product = findProductByIdOrThrow(opDto.productId());

            if (product.getStockQuantity() < opDto.quantity()) {
                throw new IllegalArgumentException(String.format(
                        "Not enough stock for product ID %s: | name: %s", product.getId(), product.getName())
                );
            }

            // Update product stock
            product.setStockQuantity(product.getStockQuantity() - opDto.quantity());
            productRepository.save(product);

            OrderProductEntity orderProductEntity = new OrderProductEntity(orderEntity, product, opDto.quantity());
            orderProductRepository.save(orderProductEntity);
        }

        return new OrderDto(orderEntity.getId(), orderEntity.getOrderValue(), orderDto.products());
    }

    @Override
    public Optional<OrderDto> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public List<OrderDto> findAll() {
        return null;
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
}