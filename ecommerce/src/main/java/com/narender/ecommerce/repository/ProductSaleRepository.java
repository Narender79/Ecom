package com.narender.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.narender.ecommerce.model.ProductSale;

@Repository
public interface ProductSaleRepository extends JpaRepository<ProductSale, Long> {
    List<ProductSale> findTop4ByOrderBySoldCountDesc();
    Optional<ProductSale> findByProductId(Long productId);
}