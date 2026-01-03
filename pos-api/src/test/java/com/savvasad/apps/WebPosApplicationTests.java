package com.savvasad.apps;

import com.savvasad.apps.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class WebPosApplicationTests {
    @Autowired
    private ProductService productService;

    @Test
    void contextLoads() {
        assertThat(productService).isNotNull();
    }
}
