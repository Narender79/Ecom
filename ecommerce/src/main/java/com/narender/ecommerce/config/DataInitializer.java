package com.narender.ecommerce.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.narender.ecommerce.model.Product;
import com.narender.ecommerce.repository.ProductRepository;

@Component
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run (String... args) throws Exception{
        if(productRepository.count()==0){
            productRepository.save(new Product("Wirelss HeadPhones","Electronics",2999.0,"",true));
            productRepository.save(new Product("Running Shoes", "Fashion", 1999.0, "", true));
            productRepository.save(new Product("Office Chair", "Furniture", 6499.0, "", true));
            productRepository.save(new Product("Smart Watch", "Electronics", 4999.0, "", false));
            System.out.println("Database seeded with initial products!");
        }
    }
}