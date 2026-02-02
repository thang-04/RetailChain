package com.sba301.retailmanagement.config;

import com.sba301.retailmanagement.entity.ProductCategory;
import com.sba301.retailmanagement.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductCategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new ProductCategory(null, "Fashion"));
            categoryRepository.save(new ProductCategory(null, "Shirts"));
            categoryRepository.save(new ProductCategory(null, "Pants"));
            categoryRepository.save(new ProductCategory(null, "Bags"));
            System.out.println(">>> SEEDED DEFAULT PRODUCT CATEGORIES");
        }
    }
}
