package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryHistoryRequest;
import com.sba301.retailmanagement.dto.response.InventoryHistoryPageResponse;
import com.sba301.retailmanagement.dto.response.InventoryHistoryResponse;
import com.sba301.retailmanagement.entity.InventoryDocument;
import com.sba301.retailmanagement.entity.InventoryHistory;
import com.sba301.retailmanagement.entity.Product;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.repository.InventoryDocumentRepository;
import com.sba301.retailmanagement.repository.InventoryHistoryRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.service.InventoryHistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryHistoryServiceImpl implements InventoryHistoryService {

    @Autowired
    private InventoryHistoryRepository inventoryHistoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WarehouseRepository warehouseRepository;
    @Autowired
    private InventoryDocumentRepository inventoryDocumentRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;

    private void fillNames(InventoryHistory e, InventoryHistoryResponse dto) {
        if (e.getDocumentId() != null) {
            inventoryDocumentRepository.findById(e.getDocumentId())
                    .map(InventoryDocument::getDocumentCode)
                    .ifPresent(dto::setDocumentName);
        }
        if (e.getWarehouseId() != null) {
            warehouseRepository.findById(e.getWarehouseId())
                    .map(Warehouse::getName)
                    .ifPresent(dto::setWarehouseName);
        }
        if (e.getVariantId() != null) {
            productVariantRepository.findById(e.getVariantId())
                    .map(v -> {
                        String productName = Optional.ofNullable(v.getProduct()).map(Product::getName).orElse("");
                        String sku = v.getSku() != null ? v.getSku() : "";
                        return (productName.isEmpty() ? sku : productName + " (" + sku + ")").trim();
                    })
                    .ifPresent(dto::setVariantName);
        }
        if (e.getActorUser() != null) {
            User u = e.getActorUser();
            dto.setActorUserName(u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername());
        }
    }

    private InventoryHistoryResponse toDto(InventoryHistory e) {
        InventoryHistoryResponse dto = new InventoryHistoryResponse();
        dto.setId(e.getId());
        dto.setDocumentId(e.getDocumentId());
        dto.setDocumentItemId(e.getDocumentItemId());
        dto.setWarehouseId(e.getWarehouseId());
        dto.setVariantId(e.getVariantId());
        dto.setAction(e.getAction());
        dto.setQuantity(e.getQuantity());
        dto.setBalanceAfter(e.getBalanceAfter());
        dto.setOccurredAt(e.getOccurredAt());
        dto.setActorUserId(e.getActorUser() != null ? e.getActorUser().getId() : null);
        fillNames(e, dto);
        return dto;
    }

    @Override
    public List<InventoryHistoryResponse> getAllInventoryHistory() {
        List<InventoryHistory> entities = inventoryHistoryRepository.findAllByOrderByOccurredAtDesc();
        List<InventoryHistoryResponse> responses = new ArrayList<>();
        for (InventoryHistory e : entities) {
            responses.add(toDto(e));
        }
        return responses;
    }

    private List<InventoryHistoryResponse> filterHistory(List<InventoryHistoryResponse> base,
                                                         String search,
                                                         String action,
                                                         LocalDateTime fromDate,
                                                         LocalDateTime toDate) {
        String keyword = search != null ? search.trim().toLowerCase(Locale.ROOT) : "";
        String actionFilter = action != null ? action.trim() : "";

        return base.stream()
                .filter(dto -> {
                    if (!keyword.isEmpty()) {
                        String combined = ("" +
                                nullSafe(dto.getDocumentName()) + " " +
                                nullSafe(dto.getDocumentId()) + " " +
                                nullSafe(dto.getWarehouseName()) + " " +
                                nullSafe(dto.getWarehouseId()) + " " +
                                nullSafe(dto.getVariantName()) + " " +
                                nullSafe(dto.getVariantId())
                        ).toLowerCase(Locale.ROOT);
                        if (!combined.contains(keyword)) {
                            return false;
                        }
                    }

                    if (!actionFilter.isEmpty() && !"all".equalsIgnoreCase(actionFilter)) {
                        if (dto.getAction() == null
                                || !dto.getAction().name().equalsIgnoreCase(actionFilter)) {
                            return false;
                        }
                    }

                    if (fromDate != null || toDate != null) {
                        if (dto.getOccurredAt() == null) {
                            return false;
                        }
                        if (fromDate != null && dto.getOccurredAt().isBefore(fromDate)) {
                            return false;
                        }
                        if (toDate != null && dto.getOccurredAt().isAfter(toDate)) {
                            return false;
                        }
                    }

                    return true;
                })
                .sorted(Comparator.comparing(
                                InventoryHistoryResponse::getOccurredAt,
                                Comparator.nullsLast(Comparator.naturalOrder()))
                        .reversed())
                .collect(Collectors.toList());
    }

    private String nullSafe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }


    @Override
    public InventoryHistoryResponse getInventoryHistoryDetail(Long id) {
        InventoryHistory e = inventoryHistoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy lịch sử tồn kho :" + id)
                );

        InventoryHistoryResponse dto = new InventoryHistoryResponse();
        dto.setId(e.getId());
        dto.setDocumentId(e.getDocumentId());
        dto.setDocumentItemId(e.getDocumentItemId());
        dto.setWarehouseId(e.getWarehouseId());
        dto.setVariantId(e.getVariantId());
        dto.setAction(e.getAction());
        dto.setQuantity(e.getQuantity());
        dto.setBalanceAfter(e.getBalanceAfter());
        dto.setOccurredAt(e.getOccurredAt());
        if (e.getActorUser() != null) {
            dto.setActorUserId(e.getActorUser().getId());
        }
        fillNames(e, dto);
        return dto;
    }



    @Override
    public void recordInventoryChange(InventoryHistoryRequest request, User actorUser) {


        InventoryHistory inventoryHistory = new InventoryHistory();

        inventoryHistory.setWarehouseId(request.getWarehouseId());
        inventoryHistory.setVariantId(request.getVariantId());
        inventoryHistory.setAction(request.getAction());
        inventoryHistory.setQuantity(request.getQuantity());
        inventoryHistory.setBalanceAfter(request.getBalanceAfter());
        inventoryHistory.setDocumentId(request.getDocumentId());
        inventoryHistory.setDocumentItemId(request.getDocumentItemId());
        inventoryHistory.setActorUser( actorUser);
        inventoryHistory.setOccurredAt(LocalDateTime.now());

        inventoryHistoryRepository.save(inventoryHistory);
    }

    @Override
    public InventoryHistoryPageResponse getInventoryHistoryPage(String search,
                                                                String action,
                                                                LocalDateTime fromDate,
                                                                LocalDateTime toDate,
                                                                int page,
                                                                int size) {
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }

        List<InventoryHistoryResponse> all = filterHistory(getAllInventoryHistory(), search, action, fromDate,
                toDate);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());

        List<InventoryHistoryResponse> items = new ArrayList<>();
        if (fromIndex < all.size()) {
            items = all.subList(fromIndex, toIndex);
        }

        return InventoryHistoryPageResponse.builder()
                .items(items)
                .totalElements(all.size())
                .page(page)
                .size(size)
                .build();
    }

    @Override
    public String exportInventoryHistoryCsv(String search,
                                            String action,
                                            LocalDateTime fromDate,
                                            LocalDateTime toDate) {
        List<InventoryHistoryResponse> data = filterHistory(getAllInventoryHistory(), search, action, fromDate,
                toDate);

        StringBuilder sb = new StringBuilder();
        sb.append("Document,Warehouse,Variant,Action,Quantity,BalanceAfter,OccurredAt,Actor\n");

        for (InventoryHistoryResponse dto : data) {
            sb.append(escapeCsv(dto.getDocumentName() != null ? dto.getDocumentName() : dto.getDocumentId()))
                    .append(',');
            sb.append(escapeCsv(dto.getWarehouseName() != null ? dto.getWarehouseName() : dto.getWarehouseId()))
                    .append(',');
            sb.append(escapeCsv(dto.getVariantName() != null ? dto.getVariantName() : dto.getVariantId()))
                    .append(',');
            sb.append(escapeCsv(dto.getAction() != null ? dto.getAction().name() : null))
                    .append(',');
            sb.append(escapeCsv(dto.getQuantity()))
                    .append(',');
            sb.append(escapeCsv(dto.getBalanceAfter()))
                    .append(',');
            sb.append(escapeCsv(dto.getOccurredAt()))
                    .append(',');
            sb.append(escapeCsv(dto.getActorUserName() != null ? dto.getActorUserName() : dto.getActorUserId()))
                    .append('\n');
        }

        return sb.toString();
    }

    private String escapeCsv(Object value) {
        if (value == null) {
            return "";
        }
        String str = String.valueOf(value);
        if (str.contains(",") || str.contains("\"") || str.contains("\n")) {
            return "\"" + str.replace("\"", "\"\"") + "\"";
        }
        return str;
    }
}
