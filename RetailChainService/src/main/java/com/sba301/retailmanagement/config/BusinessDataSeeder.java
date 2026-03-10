package com.sba301.retailmanagement.config;

import com.sba301.retailmanagement.dto.request.InventoryItemRequest;
import com.sba301.retailmanagement.dto.request.StockRequest;
import com.sba301.retailmanagement.dto.request.TransferRequest;
import com.sba301.retailmanagement.entity.*;
import com.sba301.retailmanagement.enums.Gender;
import com.sba301.retailmanagement.repository.*;
import com.sba301.retailmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Seed dữ liệu nghiệp vụ (Product/Warehouse/Inventory/Store/...) để test luồng ứng dụng.
 *
 * Bật bằng config: app.seed.business=true
 * Dữ liệu chỉ seed nếu hệ thống chưa có product nào.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed.business", havingValue = "true")
public class BusinessDataSeeder implements CommandLineRunner {

    private final ProductCategoryRepository productCategoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final StoreRepository storeRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreWarehouseRepository storeWarehouseRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryService inventoryService;

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("[BusinessDataSeeder] Bỏ qua seed vì đã có dữ liệu Product.");
            return;
        }

        log.info("[BusinessDataSeeder] START seed dữ liệu nghiệp vụ...");

        // 1) Category
        var catThoiTrang = saveCategory("Thời trang");
        var catGiaDung = saveCategory("Gia dụng");
        var catDienTu = saveCategory("Điện tử");
        var catThucPham = saveCategory("Thực phẩm");
        var catVanPhong = saveCategory("Văn phòng phẩm");

        // 2) Stores (5)
        var stores = new ArrayList<Store>();
        stores.add(saveStore("CH-HCM-Q1", "Cửa hàng Quận 1", "12 Lê Lợi, Quận 1, TP.HCM"));
        stores.add(saveStore("CH-HCM-TD", "Cửa hàng Thủ Đức", "99 Võ Văn Ngân, Thủ Đức, TP.HCM"));
        stores.add(saveStore("CH-HN-CG", "Cửa hàng Cầu Giấy", "36 Xuân Thủy, Cầu Giấy, Hà Nội"));
        stores.add(saveStore("CH-DN-HC", "Cửa hàng Hải Châu", "25 Bạch Đằng, Hải Châu, Đà Nẵng"));
        stores.add(saveStore("CH-CT-NK", "Cửa hàng Ninh Kiều", "10 Hòa Bình, Ninh Kiều, Cần Thơ"));

        // 3) Warehouses: 1 kho tổng + 5 kho cửa hàng
        var whCentral = saveWarehouse("WH-TONG-01", "Kho Tổng Miền Nam",
                "KCN Tân Bình, TP.HCM", "TP. Hồ Chí Minh", "Tân Bình", "Phường 15",
                "Nguyễn Văn Thắng", "0909 111 222", "Kho tổng phục vụ điều phối toàn hệ thống");

        var storeWarehouses = new ArrayList<Warehouse>();
        storeWarehouses.add(saveWarehouse("WH-CH-01", "Kho CH Quận 1", "12 Lê Lợi, Quận 1", "TP. Hồ Chí Minh", "Quận 1", "Bến Nghé", "Trần Thị Mai", "0901 234 567", "Kho cửa hàng Quận 1"));
        storeWarehouses.add(saveWarehouse("WH-CH-02", "Kho CH Thủ Đức", "99 Võ Văn Ngân, Thủ Đức", "TP. Hồ Chí Minh", "Thủ Đức", "Linh Chiểu", "Phạm Minh Tâm", "0902 345 678", "Kho cửa hàng Thủ Đức"));
        storeWarehouses.add(saveWarehouse("WH-CH-03", "Kho CH Cầu Giấy", "36 Xuân Thủy, Cầu Giấy", "Hà Nội", "Cầu Giấy", "Dịch Vọng", "Ngô Đức Anh", "0903 456 789", "Kho cửa hàng Cầu Giấy"));
        storeWarehouses.add(saveWarehouse("WH-CH-04", "Kho CH Hải Châu", "25 Bạch Đằng, Hải Châu", "Đà Nẵng", "Hải Châu", "Thạch Thang", "Lê Hoàng Nam", "0904 567 890", "Kho cửa hàng Hải Châu"));
        storeWarehouses.add(saveWarehouse("WH-CH-05", "Kho CH Ninh Kiều", "10 Hòa Bình, Ninh Kiều", "Cần Thơ", "Ninh Kiều", "Tân An", "Võ Mỹ Linh", "0905 678 901", "Kho cửa hàng Ninh Kiều"));

        // Link store -> warehouse (store_warehouses)
        for (int i = 0; i < stores.size(); i++) {
            linkStoreWarehouse(stores.get(i), storeWarehouses.get(i), i == 0);
        }

        // 4) Suppliers (5)
        var sup1 = saveSupplier("NCC-TP-01", "Công ty May Việt Tiến", "hotro@viettien.vn | 028 1111 2222",
                "7 Nguyễn Trãi, Quận 5, TP.HCM");
        var sup2 = saveSupplier("NCC-GD-01", "Nhựa Duy Tân", "cskh@duytan.com | 028 3333 4444",
                "298 Hồ Học Lãm, Bình Tân, TP.HCM");
        var sup3 = saveSupplier("NCC-DT-01", "Điện máy Sao Việt", "sales@saoviet.vn | 024 5555 6666",
                "18 Trần Duy Hưng, Cầu Giấy, Hà Nội");
        var sup4 = saveSupplier("NCC-TP-02", "Thực phẩm An Tâm", "cskh@antam.vn | 028 7777 8888",
                "55 Phan Đăng Lưu, Phú Nhuận, TP.HCM");
        var sup5 = saveSupplier("NCC-VP-01", "Văn phòng phẩm Minh Long", "support@minhlong.vn | 028 9999 0000",
                "120 Cộng Hòa, Tân Bình, TP.HCM");

        var suppliers = List.of(sup1, sup2, sup3, sup4, sup5);

        // 5) Products + Variants (~10 product, mỗi product 2-3 variant)
        var p1 = saveProduct(catThoiTrang.getId(), "SP-0001", "Áo thun cotton basic", "Áo thun unisex chất cotton 100%, mềm mịn, dễ phối.", Gender.UNISEX);
        var p2 = saveProduct(catThoiTrang.getId(), "SP-0002", "Quần jean slim fit", "Quần jean nam form slim, co giãn nhẹ.", Gender.MEN);
        var p3 = saveProduct(catGiaDung.getId(), "SP-0003", "Bộ hộp đựng thực phẩm 5 món", "Hộp nhựa an toàn, phù hợp bảo quản đồ ăn.", Gender.UNISEX);
        var p4 = saveProduct(catDienTu.getId(), "SP-0004", "Tai nghe Bluetooth chống ồn", "Tai nghe pin 20 giờ, chống ồn chủ động.", Gender.UNISEX);
        var p5 = saveProduct(catThucPham.getId(), "SP-0005", "Cà phê rang xay 500g", "Hương vị đậm đà, phù hợp pha phin.", Gender.UNISEX);
        var p6 = saveProduct(catVanPhong.getId(), "SP-0006", "Sổ tay bìa da A5", "Sổ tay 200 trang, giấy dày, viết mượt.", Gender.UNISEX);
        var p7 = saveProduct(catGiaDung.getId(), "SP-0007", "Bình giữ nhiệt 500ml", "Giữ nóng/lạnh 8-12h, inox 304.", Gender.UNISEX);
        var p8 = saveProduct(catDienTu.getId(), "SP-0008", "Chuột không dây", "Chuột silent click, pin bền.", Gender.UNISEX);
        var p9 = saveProduct(catThoiTrang.getId(), "SP-0009", "Váy midi hoa nhí", "Váy nữ dáng midi, nhẹ, thoáng.", Gender.WOMEN);
        var p10 = saveProduct(catThucPham.getId(), "SP-0010", "Mì gói vị bò cay (thùng 30)", "Mì gói tiện lợi, vị bò cay.", Gender.UNISEX);

        var variants = new ArrayList<ProductVariant>();
        variants.addAll(saveVariants(p1, List.of(
                variant("SKU-ATB-S-TR", "S", "Trắng", 129_000),
                variant("SKU-ATB-M-DN", "M", "Đen", 129_000),
                variant("SKU-ATB-L-XM", "L", "Xám", 139_000)
        )));
        variants.addAll(saveVariants(p2, List.of(
                variant("SKU-QJ-29-XD", "29", "Xanh đậm", 399_000),
                variant("SKU-QJ-30-XN", "30", "Xanh nhạt", 399_000)
        )));
        variants.addAll(saveVariants(p3, List.of(
                variant("SKU-HOP-500-TR", "500ml", "Trong", 89_000),
                variant("SKU-HOP-1000-TR", "1000ml", "Trong", 109_000)
        )));
        variants.addAll(saveVariants(p4, List.of(
                variant("SKU-TN-BT-DN", "One", "Đen", 799_000),
                variant("SKU-TN-BT-TR", "One", "Trắng", 799_000)
        )));
        variants.addAll(saveVariants(p5, List.of(
                variant("SKU-CP-500", "500g", "N/A", 155_000),
                variant("SKU-CP-1000", "1kg", "N/A", 295_000)
        )));
        variants.addAll(saveVariants(p6, List.of(
                variant("SKU-SOTAY-A5-NAU", "A5", "Nâu", 79_000),
                variant("SKU-SOTAY-A5-DEN", "A5", "Đen", 79_000)
        )));
        variants.addAll(saveVariants(p7, List.of(
                variant("SKU-BGN-500-XANH", "500ml", "Xanh", 199_000),
                variant("SKU-BGN-500-HONG", "500ml", "Hồng", 199_000)
        )));
        variants.addAll(saveVariants(p8, List.of(
                variant("SKU-CHUOT-WL-DEN", "One", "Đen", 249_000),
                variant("SKU-CHUOT-WL-TR", "One", "Trắng", 249_000)
        )));
        variants.addAll(saveVariants(p9, List.of(
                variant("SKU-VAY-MIDI-S", "S", "Hoa nhí", 459_000),
                variant("SKU-VAY-MIDI-M", "M", "Hoa nhí", 459_000)
        )));
        variants.addAll(saveVariants(p10, List.of(
                variant("SKU-MI-THUNG-30", "30 gói", "N/A", 315_000)
        )));

        // 6) Seed inventory movements để tạo stock + document + history
        // Import vào kho tổng (đủ lớn để transfer)
        seedImports(whCentral.getId(), suppliers.get(0).getId(), variants, 30);

        // Transfer một phần từ kho tổng về các kho cửa hàng
        seedTransfersFromCentral(whCentral.getId(), storeWarehouses, variants);

        // Export nhẹ tại kho cửa hàng (tạo lịch sử OUT)
        seedExportsAtStores(storeWarehouses, variants);

        log.info("[BusinessDataSeeder] END seed dữ liệu nghiệp vụ.");
    }

    private ProductCategory saveCategory(String name) {
        ProductCategory c = new ProductCategory();
        c.setName(name);
        return productCategoryRepository.save(c);
    }

    private Store saveStore(String code, String name, String address) {
        Store s = Store.builder()
                .code(code)
                .name(name)
                .address(address)
                .status(1)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return storeRepository.save(s);
    }

    private Warehouse saveWarehouse(String code, String name,
                                    String address, String province, String district, String ward,
                                    String contactName, String contactPhone, String description) {
        Warehouse w = new Warehouse();
        w.setCode(code);
        w.setName(name);
        w.setAddress(address);
        w.setProvince(province);
        w.setDistrict(district);
        w.setWard(ward);
        w.setContactName(contactName);
        w.setContactPhone(contactPhone);
        w.setDescription(description);
        w.setIsDefault(0);
        w.setStatus(1);
        w.setCreatedAt(LocalDateTime.now());
        w.setUpdatedAt(LocalDateTime.now());
        return warehouseRepository.save(w);
    }

    private void linkStoreWarehouse(Store store, Warehouse warehouse, boolean isDefault) {
        StoreWarehouse sw = new StoreWarehouse();
        sw.setId(new StoreWarehouseId(store.getId(), warehouse.getId()));
        sw.setStore(store);
        sw.setWarehouse(warehouse);
        sw.setIsDefault(isDefault ? 1 : 0);
        storeWarehouseRepository.save(sw);
    }

    private Supplier saveSupplier(String code, String name, String contactInfo, String address) {
        Supplier s = Supplier.builder()
                .code(code)
                .name(name)
                .contactInfo(contactInfo)
                .address(address)
                .status(1)
                .build();
        return supplierRepository.save(s);
    }

    private Product saveProduct(Long categoryId, String code, String name, String desc, Gender gender) {
        Product p = new Product();
        p.setCategoryId(categoryId);
        p.setCode(code);
        p.setName(name);
        p.setDescription(desc);
        p.setGender(gender);
        p.setStatus(1);
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(p);
    }

    private record VariantSeed(String sku, String size, String color, int priceVnd) { }

    private VariantSeed variant(String sku, String size, String color, int priceVnd) {
        return new VariantSeed(sku, size, color, priceVnd);
    }

    private List<ProductVariant> saveVariants(Product product, List<VariantSeed> seeds) {
        List<ProductVariant> list = new ArrayList<>();
        for (VariantSeed s : seeds) {
            ProductVariant v = new ProductVariant();
            v.setProductId(product.getId());
            v.setSku(s.sku());
            v.setSize(s.size());
            v.setColor(s.color());
            v.setPrice(BigDecimal.valueOf(s.priceVnd()));
            v.setStatus(1);
            v.setCreatedAt(LocalDateTime.now());
            v.setUpdatedAt(LocalDateTime.now());
            list.add(productVariantRepository.save(v));
        }
        return list;
    }

    private void seedImports(Long warehouseId, Long supplierId, List<ProductVariant> variants, int baseQty) {
        // Chia 6 đợt import để tạo dữ liệu theo thời gian
        for (int round = 1; round <= 6; round++) {
            List<InventoryItemRequest> items = new ArrayList<>();
            for (int i = 0; i < variants.size(); i++) {
                // Lấy 8-12 SKU mỗi đợt
                if (i % 3 == (round % 3) && items.size() < 10) {
                    int qty = baseQty + (round * 3) + (i % 5);
                    items.add(new InventoryItemRequest(
                            variants.get(i).getId(),
                            qty,
                            "Nhập hàng đợt " + round
                    ));
                }
            }
            StockRequest req = new StockRequest(warehouseId, supplierId, "Phiếu nhập seed đợt " + round, items);
            inventoryService.importStock(req);
        }
    }

    private void seedTransfersFromCentral(Long centralWarehouseId, List<Warehouse> storeWarehouses, List<ProductVariant> variants) {
        // Transfer 3 đợt, mỗi đợt tới 2 kho cửa hàng
        for (int round = 1; round <= 3; round++) {
            for (int wi = 0; wi < storeWarehouses.size(); wi++) {
                if ((wi + round) % 2 == 0) continue;
                Warehouse target = storeWarehouses.get(wi);
                List<InventoryItemRequest> items = new ArrayList<>();
                for (int i = 0; i < variants.size(); i++) {
                    if (i % 5 == wi % 5 && items.size() < 6) {
                        int qty = 8 + (round * 2) + (i % 3);
                        items.add(new InventoryItemRequest(
                                variants.get(i).getId(),
                                qty,
                                "Điều chuyển seed đợt " + round
                        ));
                    }
                }
                TransferRequest req = new TransferRequest();
                req.setSourceWarehouseId(centralWarehouseId);
                req.setTargetWarehouseId(target.getId());
                req.setNote("Điều chuyển seed đợt " + round + " về " + target.getName());
                req.setItems(items);
                inventoryService.transferStock(req);
            }
        }
    }

    private void seedExportsAtStores(List<Warehouse> storeWarehouses, List<ProductVariant> variants) {
        // Mỗi kho xuất nhẹ 1-2 phiếu
        for (int wi = 0; wi < storeWarehouses.size(); wi++) {
            Warehouse wh = storeWarehouses.get(wi);
            for (int round = 1; round <= 2; round++) {
                List<InventoryItemRequest> items = new ArrayList<>();
                for (int i = 0; i < variants.size(); i++) {
                    if (i % 7 == (wi + round) % 7 && items.size() < 4) {
                        int qty = 1 + (i % 2);
                        items.add(new InventoryItemRequest(
                                variants.get(i).getId(),
                                qty,
                                "Xuất bán seed"
                        ));
                    }
                }
                if (items.isEmpty()) continue;
                StockRequest req = new StockRequest(wh.getId(), null,
                        "Phiếu xuất seed (" + wh.getCode() + ") đợt " + round, items);
                inventoryService.exportStock(req);
            }
        }
    }
}

