import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import type { OrderItem } from '../types/OrderItem';

export const useCart = () => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const sum = orderItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
        setTotal(sum);
    }, [orderItems]);

    const addItem = (product: Product, quantity: number) => {
        if (!product || quantity < 1) return;

        const existing = orderItems.find(item => item.id === product.id);
        if (existing) {
            setOrderItems(orderItems.map(item =>
                item.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        totalItemPrice: (item.quantity + quantity) * item.price
                    }
                    : item
            ));
        } else {
            setOrderItems([
                ...orderItems,
                {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.retailPrice,
                    quantity,
                    totalItemPrice: product.retailPrice * quantity
                }
            ]);
        }
    };

    const removeItem = (id: number) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    const resetCart = () => {
        setOrderItems([]);
        setTotal(0);
    };

    return {
        orderItems,
        total,
        addItem,
        removeItem,
        resetCart
    };
};

