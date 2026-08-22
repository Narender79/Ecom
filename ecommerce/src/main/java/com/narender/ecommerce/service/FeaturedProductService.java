package com.narender.ecommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.repository.ProductRepository;
import com.narender.ecommerce.repository.ProductSaleRepository;

@Service
public class FeaturedProductService implements FeaturedProductInterface {
    @Autowired
    private ProductSaleRepository productSaleRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getFeaturedProducts() {
        return productSaleRepository.findTop4ByOrderBySoldCountDesc()
            .stream()
            .map(ps -> ps.getProduct())
            .collect(Collectors.toList());
    }
}