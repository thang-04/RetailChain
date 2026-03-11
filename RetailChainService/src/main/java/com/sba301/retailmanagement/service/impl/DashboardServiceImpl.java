package com.sba301.retailmanagement.service.impl;

import com.sba301.retailmanagement.dto.response.DashboardKpiItemDTO;
import com.sba301.retailmanagement.dto.response.DashboardStoreRankingDTO;
import com.sba301.retailmanagement.dto.response.DashboardStoreRowDTO;
import com.sba301.retailmanagement.dto.response.DashboardSummaryResponse;
import com.sba301.retailmanagement.dto.response.InventoryOverviewResponse;
import com.sba301.retailmanagement.dto.response.RevenueDataDTO;
import com.sba301.retailmanagement.entity.Store;
import com.sba301.retailmanagement.repository.InventoryDocumentRepository;
import com.sba301.retailmanagement.repository.InventoryStockRepository;
import com.sba301.retailmanagement.repository.ProductRepository;
import com.sba301.retailmanagement.repository.ProductVariantRepository;
import com.sba301.retailmanagement.repository.StoreRepository;
import com.sba301.retailmanagement.service.DashboardService;
import com.sba301.retailmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StoreRepository storeRepository;
    private final InventoryStockRepository inventoryStockRepository;
    private final InventoryDocumentRepository inventoryDocumentRepository;
    private final InventoryService inventoryService;

    @Override
    public DashboardSummaryResponse getSummary(String timeRange) {
        String prefix = "[getDashboardSummary]|timeRange=" + timeRange;
        log.info("{}|START", prefix);

        LocalDateTime to = LocalDate.now().plusDays(1).atStartOfDay(); // exclusive
        LocalDateTime from = resolveFrom(timeRange, to);

        long totalProducts = productRepository.count();
        long totalVariants = productVariantRepository.count();
        long activeStores = storeRepository.countByStatus(1);

        InventoryOverviewResponse invOverview = inventoryService.getInventoryOverview();
        long totalStockQuantity = invOverview != null && invOverview.getTotalStockQuantity() != null
                ? invOverview.getTotalStockQuantity()
                : 0L;
        long totalInventoryValue = invOverview != null && invOverview.getTotalChainValue() != null
                ? invOverview.getTotalChainValue()
                : 0L;

        long docCount = inventoryDocumentRepository.countByCreatedAtBetween(from, to);
        BigDecimal docAmount = inventoryDocumentRepository.sumTotalAmountBetween(from, to);
        long inventoryFlowValue = docAmount != null ? docAmount.longValue() : 0L;

        List<DashboardKpiItemDTO> kpis = List.of(
                DashboardKpiItemDTO.builder()
                        .key("totalProducts")
                        .title("Tổng sản phẩm")
                        .value(totalProducts)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("totalVariants")
                        .title("Tổng biến thể (SKU)")
                        .value(totalVariants)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("activeStores")
                        .title("Cửa hàng đang hoạt động")
                        .value(activeStores)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("inventoryValue")
                        .title("Giá trị tồn kho")
                        .value(totalInventoryValue)
                        .changePercent(invOverview != null ? invOverview.getGrowthPercentage() : null)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("inventoryFlowValue")
                        .title("Giá trị chứng từ (" + labelRange(timeRange) + ")")
                        .value(inventoryFlowValue)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("inventoryDocuments")
                        .title("Số chứng từ (" + labelRange(timeRange) + ")")
                        .value(docCount)
                        .build(),
                DashboardKpiItemDTO.builder()
                        .key("totalStockQuantity")
                        .title("Tổng tồn kho (số lượng)")
                        .value(totalStockQuantity)
                        .build()
        );

        List<RevenueDataDTO> revenueSeries = buildRevenueSeries(from, to);

        List<Store> stores = storeRepository.findAll();
        Map<Long, StoreAgg> storeAggMap = aggregateStoreInventory(stores);

        List<DashboardStoreRankingDTO> ranking = storeAggMap.entrySet().stream()
                .map(e -> {
                    Store store = e.getValue().store;
                    return DashboardStoreRankingDTO.builder()
                            .storeId(store.getId())
                            .storeCode(store.getCode())
                            .storeName(store.getName())
                            .stockQuantity(e.getValue().stockQuantity)
                            .build();
                })
                .sorted(Comparator.comparing(DashboardStoreRankingDTO::getStockQuantity).reversed())
                .limit(5)
                .toList();

        List<DashboardStoreRowDTO> storeTable = storeAggMap.entrySet().stream()
                .map(e -> {
                    StoreAgg agg = e.getValue();
                    Store store = agg.store;
                    return DashboardStoreRowDTO.builder()
                            .storeId(store.getId())
                            .storeCode(store.getCode())
                            .storeName(store.getName())
                            .address(store.getAddress())
                            .status(store.getStatus())
                            .stockQuantity(agg.stockQuantity)
                            .lowStockCount(agg.lowStockCount)
                            .build();
                })
                .sorted(Comparator.comparing(DashboardStoreRowDTO::getStockQuantity).reversed())
                .toList();

        log.info("{}|END|stores={}", prefix, stores.size());
        return DashboardSummaryResponse.builder()
                .kpis(kpis)
                .revenueSeries(revenueSeries)
                .storeRanking(ranking)
                .storeTable(storeTable)
                .build();
    }

    private List<RevenueDataDTO> buildRevenueSeries(LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = inventoryDocumentRepository.sumTotalAmountGroupByDate(from, to);
        Map<String, Long> map = new HashMap<>();
        for (Object[] r : rows) {
            if (r == null || r.length < 2) continue;
            String label = String.valueOf(r[0]); // yyyy-MM-dd
            long amt = 0L;
            if (r[1] != null) {
                if (r[1] instanceof Number n) amt = n.longValue();
                else {
                    try { amt = new BigDecimal(String.valueOf(r[1])).longValue(); } catch (Exception ignored) {}
                }
            }
            map.put(label, amt);
        }

        List<RevenueDataDTO> series = new ArrayList<>();
        LocalDate start = from.toLocalDate();
        LocalDate endExclusive = to.toLocalDate();
        for (LocalDate d = start; d.isBefore(endExclusive); d = d.plusDays(1)) {
            String label = d.toString();
            series.add(RevenueDataDTO.builder()
                    .label(label)
                    .amount(map.getOrDefault(label, 0L))
                    .build());
        }
        return series;
    }

    private Map<Long, StoreAgg> aggregateStoreInventory(List<Store> stores) {
        Map<Long, StoreAgg> result = new HashMap<>();
        for (Store store : stores) {
            Long warehouseId = store.getWarehouseId();
            List<Long> warehouseIds = warehouseId != null ? List.of(warehouseId) : List.of();

            long stockQty = 0L;
            long lowStock = 0L;
            if (!warehouseIds.isEmpty()) {
                Long sum = inventoryStockRepository.sumQuantityByWarehouseIds(warehouseIds);
                stockQty = sum != null ? sum : 0L;
                Long cnt = inventoryStockRepository.countLowStockByWarehouseIds(warehouseIds, 10);
                lowStock = cnt != null ? cnt : 0L;
            }

            result.put(store.getId(), new StoreAgg(store, stockQty, lowStock));
        }
        return result;
    }

    private LocalDateTime resolveFrom(String timeRange, LocalDateTime toExclusive) {
        if (timeRange == null) timeRange = "30days";
        return switch (timeRange) {
            case "quarter" -> toExclusive.minusMonths(3);
            case "ytd" -> LocalDate.of(LocalDate.now().getYear(), 1, 1).atStartOfDay();
            default -> toExclusive.minusDays(30);
        };
    }

    private String labelRange(String timeRange) {
        if (timeRange == null) return "30 ngày";
        return switch (timeRange) {
            case "quarter" -> "3 tháng";
            case "ytd" -> "YTD";
            default -> "30 ngày";
        };
    }

    private static class StoreAgg {
        final Store store;
        final long stockQuantity;
        final long lowStockCount;

        StoreAgg(Store store, long stockQuantity, long lowStockCount) {
            this.store = store;
            this.stockQuantity = stockQuantity;
            this.lowStockCount = lowStockCount;
        }
    }
}

