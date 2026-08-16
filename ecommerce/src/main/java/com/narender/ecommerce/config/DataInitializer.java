package com.narender.ecommerce.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.model.ProductSale;
import com.narender.ecommerce.repository.ProductRepository;
import com.narender.ecommerce.repository.ProductSaleRepository;
import com.narender.ecommerce.repository.CartItemRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductSaleRepository productSaleRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public void run(String... args) throws Exception {
     // Delete dependent records first
    productSaleRepository.deleteAll();
    cartItemRepository.deleteAll();

    // Now products can be deleted
    productRepository.deleteAll();

            productRepository.save(new Product("Wirelss HeadPhones", "Electronics", 2999.0,
                    "https://img.magnific.com/free-psd/stylish-gray-white-headphones-music-audio-device_632498-46115.jpg?semt=ais_test_b&w=740&q=80",
                    true));
            productRepository.save(new Product("Running Shoes", "Fashion", 1999.0,
                    "https://img.magnific.com/premium-psd/blue-sneakers-shoes-isolated-transparent-background-png-psd_888962-1578.jpg?semt=ais_test_b&w=740&q=80",
                    true));
            productRepository.save(new Product("Office Chair", "Furniture", 6499.0,

                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3-Ck_w_qV5MSp2cmCnTXVg8Y1DhND03fya_muFmpTDQ&s=10",
                    true));
            productRepository.save(new Product("Smart Watch", "Electronics", 4999.0,
                    "https://i.etsystatic.com/36816446/r/il/a50498/7184213318/il_fullxfull.7184213318_c3aa.jpg",
                    false));
       
            List<Product> all = productRepository.findAll();
            // Example seed: pick some products and assign sold counts
            productSaleRepository.save(new ProductSale(all.get(0), 120L));
            productSaleRepository.save(new ProductSale(all.get(1), 85L));
            productSaleRepository.save(new ProductSale(all.get(2), 60L));
            productSaleRepository.save(new ProductSale(all.get(3), 40L));
            // adjust indices and counts to match your product list

            System.out.println("Database seeded with initial products!");
    }
}