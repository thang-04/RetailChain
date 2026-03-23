package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequestCreateRequest;
import com.sba301.retailmanagement.dto.request.StockRequestItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequestRejectRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.dto.response.StockRequestItemResponse;
import com.sba301.retailmanagement.dto.response.StockRequestResponse;
import com.sba301.retailmanagement.entity.InventoryStock;
import com.sba301.retailmanagement.entity.InventoryStockId;
import com.sba301.retailmanagement.entity.ProductVariant;
import com.sba301.retailmanagement.entity.StockRequest;
import com.sba301.retailmanagement.entity.StockRequestItem;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.entity.User;
import com.sba301.retailmanagement.entity.Warehouse;
import com.sba301.retailmanagement.enums.StockRequestStatus;
import com.sba301.retailmanagement.repository.InventoryStockRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.repository.StockRequestItemRepository;
import com.sba301.retailmanagement.repository.StockRequestRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.repository.UserRepository;
import com.sba301.retailmanagement.repository.WarehouseRepository;
import com.sba301.retailmanagement.service.InventoryService;
import com.sba301.retailmanagement.service.StockRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockRequestServiceImpl implements StockRequestService {

    private final StockRequestRepository stockRequestRepository;
    private final StockRequestItemRepository stockRequestItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final InventoryService inventoryService;
    private final InventoryStockRepository inventoryStockRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                User user = userRepository.findByEmail(email).orElse(null);
                return user != null ? user.getId() : null;
            }
        } catch (Exception e) {
            log.debug("No authenticated user found");
        }
        return null;
    }

    @Override
    @Transactional
    public StockRequestResponse createRequest(StockRequestCreateRequest request) {
        log.info("[createRequest] START - storeId: {}, sourceWarehouseId: {}, targetWarehouseId: {}", 
            request.getStoreId(), request.getSourceWarehouseId(), request.getTargetWarehouseId());

        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found: " + request.getStoreId()));

        Warehouse sourceWarehouse = warehouseRepository.findById(request.getSourceWarehouseId())
                .orElseThrow(() -> new RuntimeException("Source warehouse not found: " + request.getSourceWarehouseId()));

        Warehouse targetWarehouse = warehouseRepository.findById(request.getTargetWarehouseId())
                .orElseThrow(() -> new RuntimeException("Target warehouse not found: " + request.getTargetWarehouseId()));

        String requestCode = generateRequestCode();
        StockRequest stockRequest = new StockRequest();
        stockRequest.setRequestCode(requestCode);
        stockRequest.setStoreId(request.getStoreId());
        stockRequest.setSourceWarehouseId(request.getSourceWarehouseId());
        stockRequest.setTargetWarehouseId(request.getTargetWarehouseId());
        stockRequest.setStatus(StockRequestStatus.PENDING);
        stockRequest.setNote(request.getNote());
        stockRequest.setPriority(request.getPriority() != null ? request.getPriority() : "NORMAL");
        stockRequest.setCreatedBy(getCurrentUserId() != null ? getCurrentUserId() : 1L);
        stockRequest.setCreatedAt(LocalDateTime.now());

        StockRequest savedRequest = stockRequestRepository.save(stockRequest);

        for (StockRequestItemRequest itemReq : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Product Variant not found: " + itemReq.getVariantId()));

            InventoryStock stock = inventoryStockRepository.findByWarehouseIdAndVariantIdWithLock(sourceWarehouse.getId(), variant.getId())
                    .orElse(null);

            int availableStock = stock != null && stock.getQuantity() != null ? stock.getQuantity() : 0;
            String productName = variant.getProduct() != null ? variant.getProduct().getName() : "Sản phẩm #" + variant.getId();
            if (availableStock < itemReq.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + productName + " không đủ tồn kho tại kho tổng. Hiện có: " + availableStock);
            }

            StockRequestItem item = new StockRequestItem();
            item.setStockRequestId(savedRequest.getId());
            item.setVariantId(itemReq.getVariantId());
            item.setQuantity(itemReq.getQuantity());
            item.setNote(itemReq.getNote());
            stockRequestItemRepository.save(item);
        }

        log.info("[createRequest] END - requestCode: {}", requestCode);
        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockRequestResponse> getPendingRequests() {
        return stockRequestRepository.findByStatusOrderByCreatedAtDesc(StockRequestStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockRequestResponse> getStoreRequests(Long storeId) {
        return stockRequestRepository.findByStoreIdOrderByCreatedAtDesc(storeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StockRequestResponse getRequestById(Long id) {
        StockRequest stockRequest = stockRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StockRequest not found: " + id));
        return mapToResponse(stockRequest);
    }

    @Override
    @Transactional
    public StockRequestResponse approveRequest(Long id) {
        log.info("[approveRequest] START - id: {}", id);

        StockRequest stockRequest = stockRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StockRequest not found: " + id));

        if (stockRequest.getStatus() != StockRequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể duyệt request đang ở trạng thái PENDING");
        }

        List<StockRequestItem> items = stockRequestItemRepository.findByStockRequestId(id);

        Store store = storeRepository.findById(stockRequest.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found: " + stockRequest.getStoreId()));
        
        TransferRequest transferRequest = new TransferRequest();
        transferRequest.setSourceWarehouseId(stockRequest.getSourceWarehouseId());
        transferRequest.setTargetWarehouseId(store.getWarehouseId());
        
        transferRequest.setNote("Tu yeu cau: " + stockRequest.getRequestCode());
        transferRequest.setItems(items.stream()
                .map(item -> {
                    InventoryItemRequest req = new InventoryItemRequest();
                    req.setVariantId(item.getVariantId());
                    req.setQuantity(item.getQuantity());
                    req.setNote(item.getNote());
                    return req;
                })
                .collect(Collectors.toList()));

        inventoryService.transferStock(transferRequest);

        stockRequest.setStatus(StockRequestStatus.EXPORTED);
        stockRequest.setApprovedBy(getCurrentUserId() != null ? getCurrentUserId() : 109L);
        stockRequest.setApprovedAt(LocalDateTime.now());

        StockRequest savedRequest = stockRequestRepository.save(stockRequest);

        log.info("[approveRequest] END - id: {}", id);
        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional
    public StockRequestResponse rejectRequest(Long id, StockRequestRejectRequest rejectRequest) {
        log.info("[rejectRequest] START - id: {}", id);

        StockRequest stockRequest = stockRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StockRequest not found: " + id));

        if (stockRequest.getStatus() != StockRequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể từ chối request đang ở trạng thái PENDING");
        }

        stockRequest.setStatus(StockRequestStatus.REJECTED);
        stockRequest.setRejectedBy(getCurrentUserId() != null ? getCurrentUserId() : 109L);
        stockRequest.setRejectedAt(LocalDateTime.now());
        stockRequest.setRejectReason(rejectRequest.getReason());

        StockRequest savedRequest = stockRequestRepository.save(stockRequest);

        log.info("[rejectRequest] END - id: {}", id);
        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional
    public StockRequestResponse cancelRequest(Long id, String reason) {
        log.info("[cancelRequest] START - id: {}", id);

        StockRequest stockRequest = stockRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StockRequest not found: " + id));

        if (stockRequest.getStatus() != StockRequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể hủy request đang ở trạng thái PENDING");
        }

        stockRequest.setStatus(StockRequestStatus.CANCELLED);
        stockRequest.setCancelledBy(getCurrentUserId() != null ? getCurrentUserId() : 109L);
        stockRequest.setCancelledAt(LocalDateTime.now());
        stockRequest.setCancelReason(reason);

        StockRequest savedRequest = stockRequestRepository.save(stockRequest);

        log.info("[cancelRequest] END - id: {}", id);
        return mapToResponse(savedRequest);
    }

    private synchronized String generateRequestCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = stockRequestRepository.count() + 1;
        return String.format("SR-%s-%03d", date, count);
    }

    private StockRequestResponse mapToResponse(StockRequest stockRequest) {
        Store store = stockRequest.getStoreId() != null ? 
                storeRepository.findById(stockRequest.getStoreId()).orElse(null) : null;
        Warehouse warehouse = stockRequest.getTargetWarehouseId() != null ?
                warehouseRepository.findById(stockRequest.getTargetWarehouseId()).orElse(null) : null;

        List<StockRequestItem> items = stockRequestItemRepository.findByStockRequestId(stockRequest.getId());
        List<StockRequestItemResponse> itemResponses = items.stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        StockRequestResponse.StockRequestResponseBuilder builder = StockRequestResponse.builder()
                .id(stockRequest.getId())
                .requestCode(stockRequest.getRequestCode())
                .storeId(stockRequest.getStoreId())
                .storeName(store != null ? store.getName() : null)
                .targetWarehouseId(stockRequest.getTargetWarehouseId())
                .targetWarehouseName(warehouse != null ? warehouse.getName() : null)
                .status(stockRequest.getStatus() != null ? stockRequest.getStatus().name() : null)
                .note(stockRequest.getNote())
                .priority(stockRequest.getPriority())
                .createdBy(stockRequest.getCreatedBy())
                .createdAt(stockRequest.getCreatedAt())
                .approvedBy(stockRequest.getApprovedBy())
                .approvedAt(stockRequest.getApprovedAt())
                .rejectedBy(stockRequest.getRejectedBy())
                .rejectedAt(stockRequest.getRejectedAt())
                .rejectReason(stockRequest.getRejectReason())
                .cancelledBy(stockRequest.getCancelledBy())
                .cancelledAt(stockRequest.getCancelledAt())
                .cancelReason(stockRequest.getCancelReason())
                .totalItems(items.size())
                .items(itemResponses);

        return builder.build();
    }

    private StockRequestItemResponse mapItemToResponse(StockRequestItem item) {
        ProductVariant variant = item.getVariantId() != null ?
                productVariantRepository.findById(item.getVariantId()).orElse(null) : null;

        Integer availableStock = 0;
        if (variant != null) {
            try {
                // Lay sourceWarehouseId tu StockRequest cha thong qua item.getStockRequest()
                StockRequest parentRequest = item.getStockRequest();
                Long sourceWarehouseId = parentRequest != null ? parentRequest.getSourceWarehouseId() : null;
                if (sourceWarehouseId != null) {
                    InventoryStockId stockId = new InventoryStockId(sourceWarehouseId, item.getVariantId());
                    InventoryStock stock = inventoryStockRepository.findById(stockId).orElse(null);
                    availableStock = stock != null && stock.getQuantity() != null ? stock.getQuantity() : 0;
                }
            } catch (Exception e) {
                log.warn("Could not get stock for variant: {}", item.getVariantId());
            }
        }

        String variantName = variant != null && variant.getProduct() != null ? variant.getProduct().getName() : null;
        return StockRequestItemResponse.builder()
                .id(item.getId())
                .variantId(item.getVariantId())
                .variantName(variantName)
                .sku(variant != null ? variant.getSku() : null)
                .quantity(item.getQuantity())
                .note(item.getNote())
                .availableStock(availableStock)
                .build();
    }
}
