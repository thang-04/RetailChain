package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.response.ProductResponse;
import com.sba301.retailmanagement.dto.response.ProductVariantResponse;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public List<ProductResponse> getAllProducts() {
        // Fetch all products
        List<Product> products = productRepository.findAll();
        
        // Fetch all variants and group by product ID
        List<ProductVariant> allVariants = productVariantRepository.findAll();
        Map<Long, List<ProductVariant>> variantsByProduct = allVariants.stream()
                .collect(Collectors.groupingBy(ProductVariant::getProductId));

        // Map entities to DTOs
        List<ProductResponse> responses = new ArrayList<>();
        for (Product product : products) {
            ProductResponse dto = new ProductResponse();
            dto.setId(product.getId());
            dto.setCategoryId(product.getCategoryId());
            dto.setCode(product.getCode());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setGender(product.getGender() != null ? product.getGender().name() : null);
            dto.setStatus(product.getStatus());
            dto.setCreatedAt(product.getCreatedAt());
            dto.setUpdatedAt(product.getUpdatedAt());

            // Map variants
            List<ProductVariant> variants = variantsByProduct.getOrDefault(product.getId(), new ArrayList<>());
            List<ProductVariantResponse> variantDtos = variants.stream().map(v -> {
                ProductVariantResponse vDto = new ProductVariantResponse();
                vDto.setId(v.getId());
                vDto.setProductId(v.getProductId());
                vDto.setSku(v.getSku());
                vDto.setBarcode(v.getBarcode());
                vDto.setSize(v.getSize());
                vDto.setColor(v.getColor());
                vDto.setPrice(v.getPrice());
                vDto.setStatus(v.getStatus());
                vDto.setCreatedAt(v.getCreatedAt());
                vDto.setUpdatedAt(v.getUpdatedAt());
                return vDto;
            }).collect(Collectors.toList());

            dto.setVariants(variantDtos);
            responses.add(dto);
        }

        return responses;
    }
}
