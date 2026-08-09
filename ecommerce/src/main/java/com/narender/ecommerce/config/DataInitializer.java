package com.narender.ecommerce.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.model.ProductSale;
import com.narender.ecommerce.repository.ProductRepository;
import com.narender.ecommerce.repository.ProductSaleRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductSaleRepository productSaleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            productRepository.save(new Product("Wirelss HeadPhones", "Electronics", 2999.0, "", true));
            productRepository.save(new Product("Running Shoes", "Fashion", 1999.0, "", true));
            productRepository.save(new Product("Office Chair", "Furniture", 6499.0, "", true));
            productRepository.save(new Product("Smart Watch", "Electronics", 4999.0, "", false));
            System.out.println("Database seeded with initial products!");
        }
        if (productSaleRepository.count() == 0) {
            List<Product> all = productRepository.findAll();
            // Example seed: pick some products and assign sold counts
            productSaleRepository.save(new ProductSale(all.get(0), 120L));
            productSaleRepository.save(new ProductSale(all.get(1), 85L));
            productSaleRepository.save(new ProductSale(all.get(2), 60L));
            productSaleRepository.save(new ProductSale(all.get(3), 40L));
            // adjust indices and counts to match your product list
        }
    }
}