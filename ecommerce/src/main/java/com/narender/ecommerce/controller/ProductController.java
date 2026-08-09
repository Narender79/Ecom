package com.narender.ecommerce.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;

import com.narender.ecommerce.dto.ApiResponse;
import com.narender.ecommerce.dto.ProductRequest;
import com.narender.ecommerce.repository.ProductRepository;
import com.narender.ecommerce.service.FeaturedProductService;
import com.narender.ecommerce.model.Product;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private FeaturedProductService featuredProductService;

    @GetMapping
    public ServerResponse getAllProducts(ServerRequest request) throws Exception {
        List<Product> products = productRepository.findAll();
        return ServerResponse.ok().body(new ApiResponse("Products retrieved", true,products));
    }

    @GetMapping("/{id}")
    public ServerResponse getProductById(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        return productRepository.findById(id).map(product->ServerResponse.ok().body(
            new ApiResponse("Proudcts retrieved",true,product)
        )).orElseGet(()->
        ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND).body(new ApiResponse("Product is not retrived", false)));
    }

    @PostMapping
    public ServerResponse addProduct(ServerRequest request) throws Exception {
        ProductRequest body = request.body(ProductRequest.class);
        Product product = new Product(
            body.getName(),
            body.getCategory(),
            body.getPrice(),
            body.getImageUrl(),
            true
        );

        Product savedProduct = productRepository.save(product);

        return ServerResponse.ok().body(new ApiResponse("Product added", true,savedProduct));
    }

    @PutMapping("/{id}")
    public ServerResponse updateProduct(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        ProductRequest body = request.body(ProductRequest.class);


        return productRepository.findById(id).map(existingProduct->{
            existingProduct.setName(body.getName());
            existingProduct.setCategory(body.getCategory());
            existingProduct.setPrice(body.getPrice());
            existingProduct.setImageUrl(body.getImageUrl());
            Product updateProduct = productRepository.save(existingProduct);
            return ServerResponse.ok().body(new ApiResponse("Product updated",true,updateProduct));
        }).orElseGet(()->ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND).body(new ApiResponse("Product not found",false)));
    }

    @DeleteMapping("/{id}")
    public ServerResponse deleteProduct(ServerRequest request) throws Exception {
        Long id = Long.parseLong(request.pathVariable("id"));
        if(!productRepository.existsById(id)){
            return ServerResponse.status(org.springframework.http.HttpStatus.NOT_FOUND).body(new ApiResponse("Product not found",false));
        }
        productRepository.deleteById(id);
        return ServerResponse.ok().body(new ApiResponse("Product deleted",true)) ;
    }


    public ServerResponse getFeatureProduct(ServerRequest request) throws Exception{
        List<Product> featured = featuredProductService.getFeaturedProducts();

        return ServerResponse.ok().body(new ApiResponse("Featured Products", true,featured)); 
    }

}
