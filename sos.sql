-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: retail_chain
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- Disable FK checks to allow import in any order
--
SET FOREIGN_KEY_CHECKS = 0;

--
-- Table structure for table `attendance_logs`
--

DROP TABLE IF EXISTS `attendance_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID log chấm công',
  `assignment_id` bigint DEFAULT NULL COMMENT 'FK -> shift_assignments.id. Có thể NULL nếu chấm công không gắn ca',
  `user_id` bigint NOT NULL COMMENT 'FK -> users.id. Người được chấm công',
  `store_id` bigint NOT NULL COMMENT 'FK -> stores.id. Cửa hàng phát sinh chấm công',
  `check_type` enum('IN','OUT') NOT NULL COMMENT 'IN=vào ca, OUT=ra ca',
  `method` enum('MANUAL','QR') NOT NULL COMMENT 'MANUAL=nhập tay, QR=quét QR',
  `occurred_at` datetime(3) NOT NULL COMMENT 'Thời điểm thực tế check-in/out',
  `note` varchar(255) DEFAULT NULL COMMENT 'Ghi chú',
  `created_by` bigint DEFAULT NULL COMMENT 'FK -> users.id. Ai tạo log (manager tạo hộ). Nếu tự chấm có thể = user_id',
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm ghi log vào hệ thống',
  PRIMARY KEY (`id`),
  KEY `fk_al_created_by` (`created_by`),
  KEY `idx_al_user_time` (`user_id`,`occurred_at`),
  KEY `idx_al_store_time` (`store_id`,`occurred_at`),
  KEY `idx_al_assignment` (`assignment_id`),
  CONSTRAINT `fk_al_assign` FOREIGN KEY (`assignment_id`) REFERENCES `shift_assignments` (`id`),
  CONSTRAINT `fk_al_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_al_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Log chấm công (IN/OUT) theo nhân viên/cửa hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_logs`
--

LOCK TABLES `attendance_logs` WRITE;
/*!40000 ALTER TABLE `attendance_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_document`
--

DROP TABLE IF EXISTS `inventory_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_document` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID phiếu kho',
  `document_code` varchar(50) NOT NULL COMMENT 'Mã phiếu (duy nhất): PN-20260122-0001...',
  `document_type` enum('IMPORT','EXPORT','TRANSFER','ADJUST') NOT NULL COMMENT 'IMPORT=Nhập, EXPORT=Xuất, TRANSFER=Điều chuyển, ADJUST=Điều chỉnh',
  `source_warehouse_id` bigint DEFAULT NULL COMMENT 'Kho nguồn (EXPORT/TRANSFER/ADJUST). IMPORT thường NULL',
  `target_warehouse_id` bigint DEFAULT NULL COMMENT 'Kho đích (IMPORT/TRANSFER). EXPORT thường NULL',
  `reference_type` varchar(30) DEFAULT NULL COMMENT 'Loại đối tượng tham chiếu (vd: SALES_ORDER, SUPPLIER, RETURN...)',
  `reference_id` bigint DEFAULT NULL COMMENT 'ID đối tượng tham chiếu',
  `note` varchar(500) DEFAULT NULL COMMENT 'Ghi chú phiếu',
  `created_by` bigint NOT NULL COMMENT 'FK -> users.id. Người tạo phiếu',
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo phiếu',
  `supplier_id` bigint DEFAULT NULL COMMENT 'ID nhà cung cấp (FK)',
  `total_amount` decimal(38,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `document_code` (`document_code`),
  KEY `fk_idoc_src_wh` (`source_warehouse_id`),
  KEY `fk_idoc_tgt_wh` (`target_warehouse_id`),
  KEY `fk_idoc_user` (`created_by`),
  KEY `idx_idoc_type_time` (`document_type`,`created_at`),
  KEY `idx_idoc_time` (`created_at`),
  KEY `idx_idoc_ref` (`reference_type`,`reference_id`),
  KEY `fk_idoc_supplier` (`supplier_id`),
  CONSTRAINT `fk_idoc_src_wh` FOREIGN KEY (`source_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_idoc_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `fk_idoc_tgt_wh` FOREIGN KEY (`target_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_idoc_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Phiếu nghiệp vụ kho (nhập/xuất/điều chuyển/điều chỉnh)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_document`
--

LOCK TABLES `inventory_document` WRITE;
/*!40000 ALTER TABLE `inventory_document` DISABLE KEYS */;
INSERT INTO `inventory_document` VALUES (122,'IMP-518F733E','IMPORT',NULL,136,NULL,NULL,'',109,'2026-03-11 09:24:18.682',79,398000.00,'COMPLETED'),(124,'TRF-7BFA472F','TRANSFER',136,137,NULL,NULL,'Test chuy?n kho',109,'2026-03-11 10:30:57.534',NULL,995000.00,'PENDING'),(125,'TRF-D9645369','TRANSFER',136,138,NULL,NULL,'',109,'2026-03-11 10:32:20.159',NULL,249000.00,'PENDING'),(129,'IMP-616A6B62','IMPORT',NULL,136,NULL,NULL,'',109,'2026-03-11 13:09:48.217',76,72468000.00,'COMPLETED'),(131,'IMP-5B5372D4','IMPORT',NULL,136,NULL,NULL,'',109,'2026-03-12 14:28:36.189',76,1990000.00,'COMPLETED'),(132,'TRF-E1A8550B','TRANSFER',136,139,NULL,NULL,'',109,'2026-03-12 15:05:06.966',NULL,597000.00,'PENDING'),(134,'IMP-EXCEL-B75BD452','IMPORT',NULL,136,NULL,NULL,'Nhập kho từ Excel',109,'2026-03-13 15:13:46.326',77,1500000.00,'COMPLETED'),(137,'IMP-EXCEL-F3ADB793','IMPORT',NULL,136,NULL,NULL,'Nhập kho từ Excel',109,'2026-03-14 12:51:44.687',77,1500000.00,'COMPLETED'),(138,'TRF-BF1F2F56','TRANSFER',136,138,NULL,NULL,'',109,'2026-03-14 13:02:38.960',NULL,1393000.00,'PENDING'),(139,'IMP-630D89BB','IMPORT',NULL,136,NULL,NULL,'',109,'2026-03-14 13:10:11.438',77,13726000.00,'COMPLETED'),(140,'IMP-EXCEL-31B03C6D','IMPORT',NULL,136,NULL,NULL,'Nhập kho từ Excel',109,'2026-03-14 13:14:46.005',76,4182000.00,'COMPLETED'),(141,'IMP-EXCEL-F8585A09','IMPORT',NULL,136,NULL,NULL,'Nhập kho từ Excel',109,'2026-03-15 18:29:47.071',76,4182000.00,'COMPLETED'),(142,'IMP-EXCEL-D12A36E7','IMPORT',NULL,136,NULL,NULL,'Nhập kho từ Excel',109,'2026-03-15 18:51:30.500',78,16000000.00,'COMPLETED'),(146,'TRF-2A0A65D6','TRANSFER',136,137,NULL,NULL,'Tu yeu cau: SR-20260315-001',109,'2026-03-15 20:44:05.894',NULL,995000.00,'PENDING'),(147,'TRF-5B6444A5','TRANSFER',136,138,NULL,NULL,'Tu yeu cau: SR-20260316-004',109,'2026-03-16 09:08:24.307',NULL,249000.00,'PENDING'),(148,'TRF-6479D2E3','TRANSFER',136,138,NULL,NULL,'Tu yeu cau: SR-20260316-003',109,'2026-03-16 09:52:05.767',NULL,399000.00,'COMPLETED'),(149,'TRF-07B93401','TRANSFER',136,138,NULL,NULL,'Tu yeu cau: SR-20260316-005',109,'2026-03-16 10:26:21.963',NULL,995000.00,'COMPLETED'),(150,'TRF-E19B7B9A','TRANSFER',136,138,NULL,NULL,'Tu yeu cau: SR-20260316-007',109,'2026-03-16 11:57:56.480',NULL,996000.00,'COMPLETED'),(151,'TRF-8CB4E7E3','TRANSFER',136,138,NULL,NULL,'Tu yeu cau: SR-20260316-008',109,'2026-03-16 14:26:46.424',NULL,996000.00,'COMPLETED');
/*!40000 ALTER TABLE `inventory_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_document_backup_20260311`
--

DROP TABLE IF EXISTS `inventory_document_backup_20260311`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_document_backup_20260311` (
  `id` bigint NOT NULL DEFAULT '0' COMMENT 'PK. ID phiếu kho',
  `document_code` varchar(50) NOT NULL COMMENT 'Mã phiếu (duy nhất): PN-20260122-0001...',
  `document_type` enum('IMPORT','EXPORT','TRANSFER','ADJUST') NOT NULL COMMENT 'IMPORT=Nhập, EXPORT=Xuất, TRANSFER=Điều chuyển, ADJUST=Điều chỉnh',
  `source_warehouse_id` bigint DEFAULT NULL COMMENT 'Kho nguồn (EXPORT/TRANSFER/ADJUST). IMPORT thường NULL',
  `target_warehouse_id` bigint DEFAULT NULL COMMENT 'Kho đích (IMPORT/TRANSFER). EXPORT thường NULL',
  `reference_type` varchar(30) DEFAULT NULL COMMENT 'Loại đối tượng tham chiếu (vd: SALES_ORDER, SUPPLIER, RETURN...)',
  `reference_id` bigint DEFAULT NULL COMMENT 'ID đối tượng tham chiếu',
  `note` varchar(500) DEFAULT NULL COMMENT 'Ghi chú phiếu',
  `created_by` bigint NOT NULL COMMENT 'FK -> users.id. Người tạo phiếu',
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo phiếu',
  `supplier_id` bigint DEFAULT NULL COMMENT 'ID nhà cung cấp (FK)',
  `total_amount` decimal(38,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_document_backup_20260311`
--

LOCK TABLES `inventory_document_backup_20260311` WRITE;
/*!40000 ALTER TABLE `inventory_document_backup_20260311` DISABLE KEYS */;
INSERT INTO `inventory_document_backup_20260311` VALUES (124,'TRF-7BFA472F','TRANSFER',136,137,NULL,NULL,'Test chuy?n kho',109,'2026-03-11 10:30:57.534',NULL,NULL),(125,'TRF-D9645369','TRANSFER',136,138,NULL,NULL,'',109,'2026-03-11 10:32:20.159',NULL,NULL);
/*!40000 ALTER TABLE `inventory_document_backup_20260311` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_document_item`
--

DROP TABLE IF EXISTS `inventory_document_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_document_item` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID dòng chi tiết phiếu',
  `document_id` bigint NOT NULL COMMENT 'FK -> inventory_document.id. Thuộc phiếu nào',
  `variant_id` bigint NOT NULL COMMENT 'FK -> product_variants.id. SKU nào',
  `quantity` int NOT NULL COMMENT 'Số lượng của SKU trong phiếu (luôn dương)',
  `unit_price` decimal(18,2) DEFAULT '0.00',
  `note` varchar(255) DEFAULT NULL COMMENT 'Ghi chú dòng',
  PRIMARY KEY (`id`),
  KEY `idx_idi_doc` (`document_id`),
  KEY `idx_idi_variant` (`variant_id`),
  CONSTRAINT `fk_idi_doc` FOREIGN KEY (`document_id`) REFERENCES `inventory_document` (`id`),
  CONSTRAINT `fk_idi_var` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Chi tiết các SKU trong một phiếu kho';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_document_item`
--

LOCK TABLES `inventory_document_item` WRITE;
/*!40000 ALTER TABLE `inventory_document_item` DISABLE KEYS */;
INSERT INTO `inventory_document_item` VALUES (158,122,187,1,0.00,''),(159,122,189,1,0.00,''),(160,124,186,5,0.00,NULL),(161,125,194,1,0.00,NULL),(166,129,221,1,0.00,''),(167,129,222,131,0.00,''),(169,131,186,10,0.00,''),(170,132,186,1,0.00,NULL),(171,132,189,1,0.00,NULL),(172,132,188,1,0.00,NULL),(173,134,233,10,0.00,'Nhập hàng đợt 1'),(180,137,233,10,0.00,'Nhập hàng đợt 1'),(181,138,186,1,0.00,NULL),(182,138,187,1,0.00,NULL),(183,138,188,1,0.00,NULL),(184,138,189,1,0.00,NULL),(185,138,190,1,0.00,NULL),(186,138,191,1,0.00,NULL),(187,138,192,1,0.00,NULL),(188,139,224,13,0.00,''),(189,139,212,11,0.00,''),(190,140,234,10,0.00,'Test import 1'),(191,140,235,5,0.00,'Test import 2'),(192,140,236,3,0.00,'Test import 3'),(193,141,234,10,0.00,'Test import 1'),(194,141,235,5,0.00,'Test import 2'),(195,141,236,3,0.00,'Test import 3'),(196,142,237,80,0.00,'Test không có NCC'),(203,146,186,5,0.00,'T-shirt'),(204,147,195,1,0.00,''),(205,148,199,1,0.00,''),(206,149,187,5,0.00,''),(207,150,196,4,0.00,''),(208,151,195,4,0.00,'');
/*!40000 ALTER TABLE `inventory_document_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_history`
--

DROP TABLE IF EXISTS `inventory_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_history` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID lịch sử biến động tồn kho',
  `document_id` bigint NOT NULL COMMENT 'FK -> inventory_document.id. Biến động thuộc phiếu nào',
  `document_item_id` bigint NOT NULL COMMENT 'FK -> inventory_document_item.id. Biến động thuộc dòng nào',
  `warehouse_id` bigint NOT NULL COMMENT 'FK -> warehouses.id. Kho bị ảnh hưởng',
  `variant_id` bigint NOT NULL COMMENT 'FK -> product_variants.id. SKU bị ảnh hưởng',
  `action` enum('IN','OUT') NOT NULL COMMENT 'IN=tăng tồn, OUT=giảm tồn',
  `quantity` int NOT NULL COMMENT 'Số lượng tăng/giảm',
  `balance_after` int NOT NULL COMMENT 'Tồn kho sau khi áp biến động',
  `actor_user_id` bigint NOT NULL COMMENT 'FK -> users.id. Người thực hiện thao tác',
  `occurred_at` datetime(3) NOT NULL COMMENT 'Thời điểm phát sinh biến động',
  PRIMARY KEY (`id`),
  KEY `fk_ih_item` (`document_item_id`),
  KEY `fk_ih_user` (`actor_user_id`),
  KEY `idx_ih_wh_var_time` (`warehouse_id`,`variant_id`,`occurred_at`),
  KEY `idx_ih_var_time` (`variant_id`,`occurred_at`),
  KEY `idx_ih_doc` (`document_id`),
  CONSTRAINT `fk_ih_doc` FOREIGN KEY (`document_id`) REFERENCES `inventory_document` (`id`),
  CONSTRAINT `fk_ih_item` FOREIGN KEY (`document_item_id`) REFERENCES `inventory_document_item` (`id`),
  CONSTRAINT `fk_ih_user` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_ih_var` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_ih_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Sổ lịch sử (append-only) để audit/trace biến động tồn kho';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_history`
--

LOCK TABLES `inventory_history` WRITE;
/*!40000 ALTER TABLE `inventory_history` DISABLE KEYS */;
INSERT INTO `inventory_history` VALUES (3,122,158,136,187,'IN',1,151,109,'2026-03-11 09:24:18.700'),(4,122,159,136,189,'IN',1,81,109,'2026-03-11 09:24:18.707'),(5,124,160,136,186,'OUT',5,105,109,'2026-03-11 10:30:57.592'),(6,124,160,137,186,'IN',5,20,109,'2026-03-11 10:30:57.608'),(7,125,161,136,194,'OUT',1,59,109,'2026-03-11 10:32:20.175'),(8,125,161,138,194,'IN',1,9,109,'2026-03-11 10:32:20.182'),(16,129,166,136,221,'IN',1,21,109,'2026-03-11 13:09:48.232'),(17,129,167,136,222,'IN',131,146,109,'2026-03-11 13:09:48.246'),(20,131,169,136,186,'IN',10,104,109,'2026-03-12 14:28:36.214'),(21,132,170,136,186,'OUT',1,103,109,'2026-03-12 15:05:06.998'),(22,132,170,139,186,'IN',1,11,109,'2026-03-12 15:05:07.008'),(23,132,171,136,189,'OUT',1,80,109,'2026-03-12 15:05:07.016'),(24,132,171,139,189,'IN',1,7,109,'2026-03-12 15:05:07.019'),(25,132,172,136,188,'OUT',1,117,109,'2026-03-12 15:05:07.024'),(26,132,172,139,188,'IN',1,13,109,'2026-03-12 15:05:07.028'),(27,134,173,136,233,'IN',10,10,109,'2026-03-13 15:13:46.451'),(34,137,180,136,233,'IN',10,20,109,'2026-03-14 12:51:44.731'),(35,138,181,136,186,'OUT',1,102,109,'2026-03-14 13:02:39.046'),(36,138,181,138,186,'IN',1,24,109,'2026-03-14 13:02:39.061'),(37,138,182,136,187,'OUT',1,151,109,'2026-03-14 13:02:39.074'),(38,138,182,138,187,'IN',1,19,109,'2026-03-14 13:02:39.088'),(39,138,183,136,188,'OUT',1,116,109,'2026-03-14 13:02:39.096'),(40,138,183,138,188,'IN',1,17,109,'2026-03-14 13:02:39.104'),(41,138,184,136,189,'OUT',1,79,109,'2026-03-14 13:02:39.116'),(42,138,184,138,189,'IN',1,9,109,'2026-03-14 13:02:39.123'),(43,138,185,136,190,'OUT',1,89,109,'2026-03-14 13:02:39.129'),(44,138,185,138,190,'IN',1,11,109,'2026-03-14 13:02:39.138'),(45,138,186,136,191,'OUT',1,109,109,'2026-03-14 13:02:39.146'),(46,138,186,138,191,'IN',1,13,109,'2026-03-14 13:02:39.156'),(47,138,187,136,192,'OUT',1,99,109,'2026-03-14 13:02:39.164'),(48,138,187,138,192,'IN',1,11,109,'2026-03-14 13:02:39.175'),(49,139,188,136,224,'IN',13,23,109,'2026-03-14 13:10:11.459'),(50,139,189,136,212,'IN',11,23,109,'2026-03-14 13:10:11.467'),(51,140,190,136,234,'IN',10,30,109,'2026-03-14 13:14:46.044'),(52,140,191,136,235,'IN',5,15,109,'2026-03-14 13:14:46.055'),(53,140,192,136,236,'IN',3,9,109,'2026-03-14 13:14:46.086'),(54,141,193,136,234,'IN',10,40,109,'2026-03-15 18:29:47.140'),(55,141,194,136,235,'IN',5,20,109,'2026-03-15 18:29:47.170'),(56,141,195,136,236,'IN',3,12,109,'2026-03-15 18:29:47.192'),(57,142,196,136,237,'IN',80,80,109,'2026-03-15 18:51:30.554'),(65,146,203,136,186,'OUT',5,97,109,'2026-03-15 20:44:05.911'),(66,146,203,137,186,'IN',5,25,109,'2026-03-15 20:44:05.922'),(67,147,204,136,195,'OUT',1,79,109,'2026-03-16 09:08:24.375'),(68,147,204,138,195,'IN',1,11,109,'2026-03-16 09:08:24.387'),(69,148,205,136,199,'OUT',1,59,109,'2026-03-16 09:52:05.789'),(70,148,205,138,199,'IN',1,7,109,'2026-03-16 09:52:05.796'),(71,149,206,136,187,'OUT',5,146,109,'2026-03-16 10:26:21.985'),(72,149,206,138,187,'IN',5,24,109,'2026-03-16 10:26:21.994'),(73,150,207,136,196,'OUT',4,86,109,'2026-03-16 11:57:56.506'),(74,150,207,138,196,'IN',4,12,109,'2026-03-16 11:57:56.515'),(75,151,208,136,195,'OUT',4,75,109,'2026-03-16 14:26:46.459'),(76,151,208,138,195,'IN',4,15,109,'2026-03-16 14:26:46.469');
/*!40000 ALTER TABLE `inventory_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_stock`
--

DROP TABLE IF EXISTS `inventory_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_stock` (
  `warehouse_id` bigint NOT NULL COMMENT 'FK -> warehouses.id. Kho',
  `variant_id` bigint NOT NULL COMMENT 'FK -> product_variants.id. Biến thể (SKU)',
  `quantity` int NOT NULL DEFAULT '0' COMMENT 'Số lượng tồn hiện tại trong kho (đơn vị: cái)',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật số lượng gần nhất',
  PRIMARY KEY (`warehouse_id`,`variant_id`),
  KEY `idx_is_variant` (`variant_id`),
  CONSTRAINT `fk_is_var` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `fk_is_wh` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tồn kho hiện tại theo kho + SKU (cache để query nhanh)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_stock`
--

LOCK TABLES `inventory_stock` WRITE;
/*!40000 ALTER TABLE `inventory_stock` DISABLE KEYS */;
INSERT INTO `inventory_stock` VALUES (136,186,97,'2026-03-15 20:44:05.909'),(136,187,146,'2026-03-16 10:26:21.978'),(136,188,116,'2026-03-14 13:02:39.093'),(136,189,79,'2026-03-14 13:02:39.109'),(136,190,89,'2026-03-14 13:02:39.126'),(136,191,109,'2026-03-14 13:02:39.142'),(136,192,99,'2026-03-14 13:02:39.159'),(136,193,70,'2026-03-11 08:49:33.000'),(136,194,59,'2026-03-11 10:32:20.171'),(136,195,75,'2026-03-16 14:26:46.445'),(136,196,86,'2026-03-16 11:57:56.497'),(136,197,50,'2026-03-11 08:49:33.000'),(136,198,70,'2026-03-11 08:49:33.000'),(136,199,59,'2026-03-16 09:52:05.781'),(136,200,80,'2026-03-11 08:49:33.000'),(136,201,40,'2026-03-11 08:49:33.000'),(136,202,50,'2026-03-11 08:49:33.000'),(136,203,40,'2026-03-11 08:49:33.000'),(136,204,30,'2026-03-11 08:49:33.000'),(136,205,25,'2026-03-11 08:49:33.000'),(136,206,20,'2026-03-11 08:49:33.000'),(136,207,40,'2026-03-11 08:49:33.000'),(136,208,35,'2026-03-11 08:49:33.000'),(136,209,30,'2026-03-11 08:49:33.000'),(136,210,15,'2026-03-11 08:49:33.000'),(136,211,15,'2026-03-11 08:49:33.000'),(136,212,23,'2026-03-14 13:10:11.465'),(136,213,20,'2026-03-11 08:49:33.000'),(136,214,20,'2026-03-11 08:49:33.000'),(136,215,25,'2026-03-11 08:49:33.000'),(136,216,25,'2026-03-11 08:49:33.000'),(136,217,15,'2026-03-11 08:49:33.000'),(136,218,15,'2026-03-11 08:49:33.000'),(136,219,15,'2026-03-11 08:49:33.000'),(136,220,10,'2026-03-11 08:49:33.000'),(136,221,21,'2026-03-11 13:09:48.230'),(136,222,146,'2026-03-11 13:09:48.243'),(136,223,10,'2026-03-11 08:49:33.000'),(136,224,23,'2026-03-14 13:10:11.458'),(136,225,10,'2026-03-11 08:49:33.000'),(136,226,8,'2026-03-11 08:49:33.000'),(136,227,10,'2026-03-11 08:49:33.000'),(136,228,10,'2026-03-11 08:49:33.000'),(136,229,15,'2026-03-11 08:49:33.000'),(136,230,10,'2026-03-11 08:49:33.000'),(136,231,10,'2026-03-11 08:49:33.000'),(136,232,15,'2026-03-11 08:49:33.000'),(136,233,20,'2026-03-14 12:51:44.711'),(136,234,40,'2026-03-15 18:29:47.104'),(136,235,20,'2026-03-15 18:29:47.164'),(136,236,12,'2026-03-15 18:29:47.187'),(136,237,320,'2026-03-16 14:31:38.263'),(136,238,100,'2026-03-15 19:20:51.801'),(136,239,50,'2026-03-15 19:20:51.825'),(136,240,30,'2026-03-15 19:20:51.856'),(137,186,25,'2026-03-15 20:44:05.920'),(137,187,20,'2026-03-11 08:49:45.000'),(137,188,15,'2026-03-11 08:49:45.000'),(137,189,10,'2026-03-11 08:49:45.000'),(137,190,12,'2026-03-11 08:49:45.000'),(137,191,15,'2026-03-11 08:49:45.000'),(137,192,12,'2026-03-11 08:49:45.000'),(137,193,8,'2026-03-11 08:49:45.000'),(137,194,10,'2026-03-11 08:49:45.000'),(137,195,12,'2026-03-11 08:49:45.000'),(137,196,10,'2026-03-11 08:49:45.000'),(137,197,8,'2026-03-11 08:49:45.000'),(137,198,10,'2026-03-11 08:49:45.000'),(137,199,8,'2026-03-11 08:49:45.000'),(137,200,10,'2026-03-11 08:49:45.000'),(137,205,8,'2026-03-11 08:49:45.000'),(137,206,6,'2026-03-11 08:49:45.000'),(137,207,5,'2026-03-11 08:49:45.000'),(137,208,6,'2026-03-11 08:49:45.000'),(137,209,5,'2026-03-11 08:49:45.000'),(137,210,4,'2026-03-11 08:49:45.000'),(137,217,3,'2026-03-11 08:49:45.000'),(137,218,3,'2026-03-11 08:49:45.000'),(137,219,4,'2026-03-11 08:49:45.000'),(137,220,3,'2026-03-11 08:49:45.000'),(138,186,24,'2026-03-14 13:02:39.056'),(138,187,24,'2026-03-16 10:26:21.991'),(138,188,17,'2026-03-14 13:02:39.100'),(138,189,9,'2026-03-14 13:02:39.119'),(138,190,11,'2026-03-14 13:02:39.134'),(138,191,13,'2026-03-14 13:02:39.148'),(138,192,11,'2026-03-14 13:02:39.169'),(138,193,6,'2026-03-11 08:50:00.000'),(138,194,9,'2026-03-11 10:32:20.179'),(138,195,15,'2026-03-16 14:26:46.467'),(138,196,12,'2026-03-16 11:57:56.512'),(138,197,6,'2026-03-11 08:50:00.000'),(138,198,8,'2026-03-11 08:50:00.000'),(138,199,7,'2026-03-16 09:52:05.793'),(138,200,8,'2026-03-11 08:50:00.000'),(138,205,6,'2026-03-11 08:50:00.000'),(138,206,5,'2026-03-11 08:50:00.000'),(138,207,4,'2026-03-11 08:50:00.000'),(138,208,5,'2026-03-11 08:50:00.000'),(138,209,4,'2026-03-11 08:50:00.000'),(138,210,3,'2026-03-11 08:50:00.000'),(138,217,2,'2026-03-11 08:50:00.000'),(138,218,3,'2026-03-11 08:50:00.000'),(138,219,3,'2026-03-11 08:50:00.000'),(138,220,2,'2026-03-11 08:50:00.000'),(139,186,11,'2026-03-12 15:05:07.004'),(139,187,15,'2026-03-11 08:50:09.000'),(139,188,13,'2026-03-12 15:05:07.026'),(139,189,7,'2026-03-12 15:05:07.017'),(139,190,8,'2026-03-11 08:50:09.000'),(139,191,10,'2026-03-11 08:50:09.000'),(139,192,8,'2026-03-11 08:50:09.000'),(139,193,5,'2026-03-11 08:50:09.000'),(139,194,6,'2026-03-11 08:50:09.000'),(139,195,8,'2026-03-11 08:50:09.000'),(139,196,6,'2026-03-11 08:50:09.000'),(139,197,5,'2026-03-11 08:50:09.000'),(139,198,6,'2026-03-11 08:50:09.000'),(139,199,5,'2026-03-11 08:50:09.000'),(139,200,6,'2026-03-11 08:50:09.000'),(139,205,5,'2026-03-11 08:50:09.000'),(139,206,4,'2026-03-11 08:50:09.000'),(139,207,3,'2026-03-11 08:50:09.000'),(139,208,4,'2026-03-11 08:50:09.000'),(139,209,3,'2026-03-11 08:50:09.000'),(139,210,2,'2026-03-11 08:50:09.000'),(139,217,2,'2026-03-11 08:50:09.000'),(139,218,2,'2026-03-11 08:50:09.000'),(139,219,2,'2026-03-11 08:50:09.000'),(139,220,2,'2026-03-11 08:50:09.000');
/*!40000 ALTER TABLE `inventory_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_codes`
--

DROP TABLE IF EXISTS `otp_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_codes`
--

LOCK TABLES `otp_codes` WRITE;
/*!40000 ALTER TABLE `otp_codes` DISABLE KEYS */;
INSERT INTO `otp_codes` VALUES (1,'hungbeoku@gmail.com','2026-03-16 14:48:10.783060','246492');
/*!40000 ALTER TABLE `otp_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_7lcb6glmvwlro3p2w2cewxtvd` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (53,'PROFILE_VIEW','View profile','PROFILE_VIEW'),(54,'PROFILE_UPDATE','Update profile','PROFILE_UPDATE'),(55,'PASSWORD_CHANGE','Change password','PASSWORD_CHANGE'),(56,'STAFF_VIEW','View staff','STAFF_VIEW'),(57,'STAFF_CREATE','Create staff','STAFF_CREATE'),(58,'STAFF_UPDATE','Update staff','STAFF_UPDATE'),(59,'STAFF_DELETE','Delete staff','STAFF_DELETE'),(60,'STORE_MANAGER_VIEW','View store manager','STORE_MANAGER_VIEW'),(61,'STORE_MANAGER_CREATE','Create store manager','STORE_MANAGER_CREATE'),(62,'STORE_MANAGER_UPDATE','Update store manager','STORE_MANAGER_UPDATE'),(63,'STORE_MANAGER_DELETE','Delete store manager','STORE_MANAGER_DELETE'),(64,'STORE_SCOPE_ASSIGN','Assign store scope','STORE_SCOPE_ASSIGN'),(65,'REGIONAL_ADMIN_VIEW','View regional admin','REGIONAL_ADMIN_VIEW'),(66,'REGIONAL_ADMIN_CREATE','Create regional admin','REGIONAL_ADMIN_CREATE'),(67,'REGIONAL_ADMIN_UPDATE','Update regional admin','REGIONAL_ADMIN_UPDATE'),(68,'REGIONAL_ADMIN_DELETE','Delete regional admin','REGIONAL_ADMIN_DELETE'),(69,'WAREHOUSE_SCOPE_ASSIGN','Assign warehouse scope','WAREHOUSE_SCOPE_ASSIGN'),(70,'PERMISSION_VIEW','View permission','PERMISSION_VIEW'),(71,'PERMISSION_CREATE','Create permission','PERMISSION_CREATE'),(72,'ROLE_VIEW','View role','ROLE_VIEW'),(73,'ROLE_CREATE','Create role','ROLE_CREATE'),(74,'ROLE_UPDATE','Update role','ROLE_UPDATE'),(75,'ROLE_DELETE','Delete role','ROLE_DELETE'),(76,'USER_BLOCK','Block user','USER_BLOCK'),(77,'USER_UNBLOCK','Unblock user','USER_UNBLOCK'),(78,'STORE_VIEW','View store','STORE_VIEW'),(79,'STORE_CREATE','Create store','STORE_CREATE'),(80,'STORE_UPDATE','Update store','STORE_UPDATE'),(81,'STORE_DELETE','Delete store','STORE_DELETE'),(82,'WAREHOUSE_VIEW','View warehouse','WAREHOUSE_VIEW'),(83,'WAREHOUSE_CREATE','Create warehouse','WAREHOUSE_CREATE'),(84,'WAREHOUSE_UPDATE','Update warehouse','WAREHOUSE_UPDATE'),(85,'WAREHOUSE_DELETE','Delete warehouse','WAREHOUSE_DELETE'),(86,'INVENTORY_VIEW','View inventory','INVENTORY_VIEW'),(87,'INVENTORY_CREATE','Create inventory','INVENTORY_CREATE'),(88,'INVENTORY_UPDATE','Update inventory','INVENTORY_UPDATE'),(89,'INVENTORY_TRANSFER','Transfer inventory','INVENTORY_TRANSFER'),(90,'PRODUCT_VIEW','View product','PRODUCT_VIEW'),(91,'PRODUCT_CREATE','Create product','PRODUCT_CREATE'),(92,'PRODUCT_UPDATE','Update product','PRODUCT_UPDATE'),(93,'PRODUCT_DELETE','Delete product','PRODUCT_DELETE'),(94,'ORDER_VIEW','View order','ORDER_VIEW'),(95,'ORDER_CREATE','Create order','ORDER_CREATE'),(96,'ORDER_UPDATE','Update order','ORDER_UPDATE'),(97,'ORDER_CANCEL','Cancel order','ORDER_CANCEL'),(98,'REPORT_STORE_VIEW','View report store','REPORT_STORE_VIEW'),(99,'REPORT_REGION_VIEW','View report region','REPORT_REGION_VIEW'),(100,'REPORT_SYSTEM_VIEW','View report system','REPORT_SYSTEM_VIEW'),(101,'SUPPLIER_VIEW','View supplier','SUPPLIER_VIEW'),(102,'SUPPLIER_CREATE','Create supplier','SUPPLIER_CREATE'),(103,'SUPPLIER_UPDATE','Update supplier','SUPPLIER_UPDATE'),(104,'SUPPLIER_DELETE','Delete supplier','SUPPLIER_DELETE'),(105,'STOCKIN_CREATE',NULL,'STOCKIN_CREATE'),(106,'STOCKIN_VIEW',NULL,'STOCKIN_VIEW'),(107,'STOCKOUT_CREATE',NULL,'STOCKOUT_CREATE'),(108,'STOCKOUT_VIEW',NULL,'STOCKOUT_VIEW'),(109,'REPORT_VIEW',NULL,'REPORT_VIEW'),(110,'HR_VIEW',NULL,'HR_VIEW'),(111,'HR_UPDATE',NULL,'HR_UPDATE'),(112,'SHIFT_VIEW',NULL,'SHIFT_VIEW'),(113,'SHIFT_UPDATE',NULL,'SHIFT_UPDATE');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID danh mục sản phẩm',
  `name` varchar(255) NOT NULL COMMENT 'Tên danh mục (vd: Áo, Quần, Váy...)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh mục sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (146,'Áo Thun'),(147,'Áo Sơ Mi'),(148,'Quần Jeans'),(149,'Quần Tây'),(150,'Váy/Đầm'),(151,'Giày Thể Thao'),(152,'Giày Da'),(153,'Túi Xách'),(154,'Mũ'),(155,'Phụ Kiện');
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID biến thể (SKU thực tế)',
  `product_id` bigint NOT NULL COMMENT 'FK -> products.id. Thuộc model nào',
  `sku` varchar(80) NOT NULL COMMENT 'SKU duy nhất cho biến thể (size+màu). Dùng trong bán/nhập/xuất',
  `barcode` varchar(80) DEFAULT NULL COMMENT 'Mã vạch (nếu có). NULL allowed, nếu có phải duy nhất',
  `size` varchar(30) NOT NULL COMMENT 'Size (S/M/L/XL/28/29...)',
  `color` varchar(50) NOT NULL COMMENT 'Màu (Black/White/Red...)',
  `price` decimal(10,2) DEFAULT NULL,
  `status` int NOT NULL,
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `uk_variant` (`product_id`,`size`,`color`),
  UNIQUE KEY `UKqftlp982upbw9ey6wuyt4a4ga` (`product_id`,`size`,`color`),
  UNIQUE KEY `barcode` (`barcode`),
  KEY `idx_pv_product` (`product_id`),
  KEY `idx_pv_status` (`status`),
  CONSTRAINT `fk_pv_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Biến thể sản phẩm theo size/màu (SKU thực tế)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (186,185,'TSHIRT-001-S-WHI','8935012340001','S','Trắng',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(187,185,'TSHIRT-001-M-WHI','8935012340002','M','Trắng',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(188,185,'TSHIRT-001-L-WHI','8935012340003','L','Trắng',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(189,185,'TSHIRT-001-XL-WHI','8935012340004','XL','Trắng',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(190,185,'TSHIRT-001-S-BLK','8935012340005','S','Đen',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(191,185,'TSHIRT-001-M-BLK','8935012340006','M','Đen',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(192,185,'TSHIRT-001-L-BLK','8935012340007','L','Đen',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(193,185,'TSHIRT-001-XL-BLK','8935012340008','XL','Đen',199000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(194,186,'TSHIRT-002-M-GRY','8935012340010','M','Xám',249000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(195,186,'TSHIRT-002-L-GRY','8935012340011','L','Xám',249000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(196,186,'TSHIRT-002-XL-GRY','8935012340012','XL','Xám',249000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(197,186,'TSHIRT-002-M-NVY','8935012340013','M','Xanh Navy',249000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(198,186,'TSHIRT-002-L-NVY','8935012340014','L','Xanh Navy',249000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(199,187,'SHIRT-001-M-WHI','8935012340020','M','Trắng',399000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(200,187,'SHIRT-001-L-WHI','8935012340021','L','Trắng',399000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(201,187,'SHIRT-001-XL-WHI','8935012340022','XL','Trắng',399000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(202,188,'SHIRT-002-S-BLU','8935012340025','S','Xanh',349000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(203,188,'SHIRT-002-M-BLU','8935012340026','M','Xanh',349000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(204,188,'SHIRT-002-L-BLU','8935012340027','L','Xanh',349000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(205,189,'JEANS-001-30-BLU','8935012340030','30','Xanh',499000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(206,189,'JEANS-001-32-BLU','8935012340031','32','Xanh',499000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(207,189,'JEANS-001-34-BLU','8935012340032','34','Xanh',499000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(208,190,'JEANS-002-26-BLK','8935012340035','26','Đen',449000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(209,190,'JEANS-002-28-BLK','8935012340036','28','Đen',449000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(210,190,'JEANS-002-30-BLK','8935012340037','30','Đen',449000.00,1,'2026-03-11 08:47:45.000','2026-03-11 08:47:45.000'),(211,191,'PANTS-001-30-BLK','8935012340040','30','Đen',599000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(212,191,'PANTS-001-32-BLK','8935012340041','32','Đen',599000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(213,191,'PANTS-001-34-BLK','8935012340042','34','Đen',599000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(214,192,'DRESS-001-S-FLR','8935012340045','S','Hoa',649000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(215,192,'DRESS-001-M-FLR','8935012340046','M','Hoa',649000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(216,192,'DRESS-001-L-FLR','8935012340047','L','Hoa',649000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(217,193,'SHOES-001-40-WHT','8935012340050','40','Trắng',899000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(218,193,'SHOES-001-41-WHT','8935012340051','41','Trắng',899000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(219,193,'SHOES-001-42-WHT','8935012340052','42','Trắng',899000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(220,193,'SHOES-001-43-WHT','8935012340053','43','Trắng',899000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(221,194,'SHOES-002-38-WHT','8935012340055','38','Trắng',549000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(222,194,'SHOES-002-39-WHT','8935012340056','39','Trắng',549000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(223,194,'SHOES-002-40-WHT','8935012340057','40','Trắng',549000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(224,194,'SHOES-002-41-WHT','8935012340058','41','Trắng',549000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(225,195,'SHOES-003-40-BRN','8935012340060','40','Nâu',1299000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(226,195,'SHOES-003-41-BRN','8935012340061','41','Nâu',1299000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(227,195,'SHOES-003-42-BRN','8935012340062','42','Nâu',1299000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(228,196,'BAG-001-UNI-BLK','8935012340065','UNI','Đen',459000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(229,197,'HAT-001-UNI-BGE','8935012340067','UNI','Be',159000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(230,197,'HAT-001-UNI-BLK','8935012340068','UNI','Đen',159000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(231,198,'ACC-001-UNI-BLK','8935012340070','UNI','Đen',299000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(232,199,'ACC-002-UNI-GLD','8935012340072','UNI','Vàng',459000.00,1,'2026-03-11 08:48:07.000','2026-03-11 08:48:07.000'),(233,200,'TEST-001',NULL,'L','Xám',150000.00,1,'2026-03-13 15:13:46.415','2026-03-13 15:13:46.415'),(234,201,'TSHIRT-TEST-001',NULL,'M','Trắng',199000.00,1,'2026-03-13 15:14:40.032','2026-03-13 15:14:40.032'),(235,202,'TSHIRT-TEST-002',NULL,'L','Đen',199000.00,1,'2026-03-13 15:14:40.061','2026-03-13 15:14:40.061'),(236,203,'PANTS-TEST-001',NULL,'32','Xanh Navy',399000.00,1,'2026-03-13 15:14:40.093','2026-03-13 15:14:40.093'),(237,204,'SKU003',NULL,'M','Trắng',200000.00,1,'2026-03-15 18:51:30.529','2026-03-15 18:51:30.529'),(238,205,'SKU001',NULL,'S','Đen',150000.00,1,'2026-03-15 19:20:51.787','2026-03-15 19:20:51.787'),(239,206,'SKU002',NULL,'32','Xanh Navy',350000.00,1,'2026-03-15 19:20:51.820','2026-03-15 19:20:51.820'),(240,207,'SKU004',NULL,'42','Đen',450000.00,1,'2026-03-15 19:20:51.850','2026-03-15 19:20:51.850');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID sản phẩm (model/mẫu)',
  `category_id` bigint NOT NULL COMMENT 'FK -> product_categories.id. Danh mục',
  `code` varchar(50) NOT NULL COMMENT 'Mã model sản phẩm (vd: TSHIRT-001)',
  `name` varchar(255) NOT NULL COMMENT 'Tên sản phẩm/model (vd: Áo thun basic nam)',
  `description` text COMMENT 'Mô tả chi tiết sản phẩm',
  `gender` enum('MEN','WOMEN','UNISEX','KIDS') DEFAULT NULL COMMENT 'Đối tượng: Nam/Nữ/Unisex/Trẻ em',
  `status` int NOT NULL,
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  `image` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `UK_ostq1ec3toafnjok09y9l7dox` (`slug`),
  KEY `idx_products_cat` (`category_id`),
  KEY `idx_products_status` (`status`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=208 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Sản phẩm cấp model (không phân biệt size/màu)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (185,146,'TSHIRT-001','Áo Thun Basic Cotton','Áo thun nam chất liệu cotton 100%, thoáng mát, phù hợp mặc hàng ngày','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'ao-thun-basic-cotton'),(186,146,'TSHIRT-002','Áo Thun Oversize','Áo thun oversize phong cách Hàn Quốc, chất liệu cotton mềm mại','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'ao-thun-oversize'),(187,147,'SHIRT-001','Sơ Mi Nam Classic','Sơ mi nam công sở, cổ đức, chất liệu vải lụa mịn','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'so-mi-nam-classic'),(188,147,'SHIRT-002','Sơ Mi Nữ Business','Sơ mi nữ công sở, dáng ôm, phù hợp với quần tây','WOMEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'so-mi-nu-business'),(189,148,'JEANS-001','Quần Jeans Slim Fit','Quần jeans nam dáng slim fit, wash xanh nhạt','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'quan-jeans-slim-fit'),(190,148,'JEANS-002','Quần Jeans Skinny','Quần jeans nữ dáng skinny, ôm sát, thoải mái','WOMEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'quan-jeans-skinny'),(191,149,'PANTS-001','Quần Tây Nam Formal','Quần tây nam dáng straight, phù hợp mặc công sở','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'quan-tay-nam-formal'),(192,150,'DRESS-001','Đầm Midi Hoa','Đầm midi dáng A, họa tiết hoa nhí, phù hợp đi làm và dạo phố','WOMEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'dam-midi-hoa'),(193,151,'SHOES-001','Giày Thể Thao Running','Giày running nam, đế cao su êm, phù hợp chạy bộ và tập gym','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'giay-the-thao-running'),(194,151,'SHOES-002','Giày Sneaker Basic','Giày sneaker trắng basic, phối được mọi trang phục','UNISEX',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'giay-sneaker-basic'),(195,152,'SHOES-003','Giày Da Nam Oxford','Giày da nam oxford, dáng thanh lịch, phù hợp công sở','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'giay-da-nam-oxford'),(196,153,'BAG-001','Túi Xách Nam Messenger','Túi xách nam messenger, chất liệu da tổng hợp','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'tui-xach-nam-messenger'),(197,154,'HAT-001','Mũ Bucket Hat','Mũ bucket hat, che nắng tốt, phong cách streetwear','UNISEX',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'mu-bucket-hat'),(198,155,'ACC-001','Thắt Lưng Da','Thắt lưng nam da bò, mạch kim loại','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'that-lung-da'),(199,155,'ACC-002','Kính Râm Aviator','Kính râm nam kiểu aviator, tròng kính polarized','MEN',1,'2026-03-11 08:47:15.000','2026-03-11 08:47:15.000',NULL,'kinh-ram-aviator'),(200,147,'TEST-001','Áo Thun Nam Size M',NULL,NULL,1,'2026-03-13 15:13:46.395','2026-03-13 15:13:46.395',NULL,'o-thun-nam-size-m-test-001'),(201,147,'TSHIRT-TEST-001','Áo Thun Test 1',NULL,NULL,1,'2026-03-13 15:14:40.023','2026-03-13 15:14:40.023',NULL,'o-thun-test-1-tshirt-test-001'),(202,147,'TSHIRT-TEST-002','Áo Thun Test 2',NULL,NULL,1,'2026-03-13 15:14:40.055','2026-03-13 15:14:40.055',NULL,'o-thun-test-2-tshirt-test-002'),(203,147,'PANTS-TEST-001','Quần Jeans Test',NULL,NULL,1,'2026-03-13 15:14:40.086','2026-03-13 15:14:40.086',NULL,'qun-jeans-test-pants-test-001'),(204,147,'SKU003','Áo Sơ Mi Trắng',NULL,NULL,1,'2026-03-15 18:51:30.513','2026-03-15 18:51:30.514',NULL,'o-s-mi-trng-sku003'),(205,146,'SKU001','Áo Thun Nam Cotton',NULL,NULL,1,'2026-03-15 19:20:51.777','2026-03-15 19:20:51.777',NULL,'o-thun-nam-cotton-sku001'),(206,148,'SKU002','Quần Jeans Slim',NULL,NULL,1,'2026-03-15 19:20:51.816','2026-03-15 19:20:51.816',NULL,'qun-jeans-slim-sku002'),(207,151,'SKU004','Giày Sneaker Nam',NULL,NULL,1,'2026-03-15 19:20:51.845','2026-03-15 19:20:51.845',NULL,'giy-sneaker-nam-sku004');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(512) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (34,'2026-03-19 08:36:20.874798','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInVzZXJpZCI6MTE5LCJpYXQiOjE3NzMzMDQ1ODAsImV4cCI6MTc3MzkwOTM4MH0.0iqVty2aMT51pkZ0i1Ke0lxq2Z4aTJeq_bZVoxro53zjE3SQIYLnvu40zP66X6iSSQ69CaL5027f_LC1XWfDeA',119),(35,'2026-03-19 09:00:51.125132','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInVzZXJpZCI6MTE5LCJpYXQiOjE3NzMzMDYwNTEsImV4cCI6MTc3MzkxMDg1MX0.anu6sA9C3a6CzIMQYsIKbWcg1DChWfTX4v1a8ZQZEHDhfkguXJeblridWCkOL2a7oAjnVEkcHYudeDSp9682sw',119),(48,'2026-03-21 06:33:50.427199','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ4dWFuaHVuZzA2MTIwNEBnbWFpbC5jb20iLCJ1c2VyaWQiOjEyMSwiaWF0IjoxNzczNDcwMDMwLCJleHAiOjE3NzQwNzQ4MzB9.Hbmh2OEjkoNM1DJH2zOmL8BSoVikDf1hw1WPDgzzKpkjIAm9ytcYmE1dUO5Z7vWaW8lc8p2z78raeNQOVBIDdg',121),(88,'2026-03-23 02:56:35.068832','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodW5nYmVva3VAZ21haWwuY29tIiwidXNlcmlkIjoxMjAsImlhdCI6MTc3MzYyOTc5NSwiZXhwIjoxNzc0MjM0NTk1fQ.VCd4RFDGV4aHqY9J8SSZhIhWzV-MqngAAcbZ_ypg-bW2hc2oPoLW3eb6wpKgz3RhD9pqYLdxYGRwTnsuLuUhGw',120),(91,'2026-03-23 04:56:25.838873','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodW5nYmVva3VAZ21haWwuY29tIiwidXNlcmlkIjoxMjAsImlhdCI6MTc3MzYzNjk4NSwiZXhwIjoxNzc0MjQxNzg1fQ.ty3RkaT-514FjuBYkH69rxuSDsSfszXhenW73_SfDeiw9VZ20wdHwzGxwENp6aAqNlx3lBUlKAZhOR6F_94Tww',120),(93,'2026-03-23 07:23:13.754088','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodW5nYmVva3VAZ21haWwuY29tIiwidXNlcmlkIjoxMjAsImlhdCI6MTc3MzY0NTc5MywiZXhwIjoxNzc0MjUwNTkzfQ.pvqzxuv7EW_HTlnsQIFiNhASaVPliO_p2QHtQbL6cHMi5JCrbZx_q2J2kfhiX6A6yVzCXIOvgVeXliGzV8gEJA',120);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (72,56),(73,56),(72,57),(73,57),(72,58),(73,58),(72,59),(72,70),(72,71),(72,72),(72,73),(72,74),(72,75),(72,76),(73,76),(72,77),(73,77),(72,78),(73,78),(74,78),(72,79),(72,80),(72,81),(72,82),(72,83),(72,84),(72,85),(72,86),(73,86),(74,86),(72,87),(73,87),(72,88),(73,88),(72,89),(73,89),(72,90),(73,90),(74,90),(72,91),(72,92),(72,93),(72,101),(72,102),(72,103),(72,104),(72,105),(73,105),(72,106),(73,106),(72,107),(73,107),(72,108),(73,108),(72,109),(73,109),(72,110),(73,110),(72,111),(73,111),(72,112),(73,112),(72,113),(73,113);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID role',
  `code` varchar(50) NOT NULL COMMENT 'Mã role (duy nhất): ADMIN, STORE_MANAGER, STAFF',
  `name` varchar(255) NOT NULL COMMENT 'Tên role hiển thị',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách role (phân quyền theo vai trò)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (72,'SUPER_ADMIN','Super Administrator',NULL),(73,'STORE_MANAGER','Store Manager',NULL),(74,'STAFF','Staff',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_assignments`
--

DROP TABLE IF EXISTS `shift_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID phân ca',
  `shift_id` bigint NOT NULL COMMENT 'FK -> shifts.id. Ca nào',
  `user_id` bigint NOT NULL COMMENT 'FK -> users.id. Nhân viên được phân ca',
  `work_date` date NOT NULL COMMENT 'Ngày làm việc của ca',
  `status` enum('ASSIGNED','CANCELLED') NOT NULL DEFAULT 'ASSIGNED' COMMENT 'Trạng thái phân ca',
  `created_by` bigint NOT NULL COMMENT 'FK -> users.id. Người tạo phân ca (manager/admin)',
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo phân ca',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sa` (`user_id`,`work_date`,`shift_id`),
  KEY `fk_sa_created_by` (`created_by`),
  KEY `idx_sa_user_date` (`user_id`,`work_date`),
  KEY `idx_sa_shift_date` (`shift_id`,`work_date`),
  CONSTRAINT `fk_sa_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_sa_shift` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`),
  CONSTRAINT `fk_sa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Lịch phân ca cho nhân viên theo ngày';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_assignments`
--

LOCK TABLES `shift_assignments` WRITE;
/*!40000 ALTER TABLE `shift_assignments` DISABLE KEYS */;
INSERT INTO `shift_assignments` VALUES (56,73,111,'2026-03-16','ASSIGNED',109,'2026-03-16 14:29:03.249');
/*!40000 ALTER TABLE `shift_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID ca làm',
  `store_id` bigint NOT NULL COMMENT 'FK -> stores.id. Ca thuộc cửa hàng nào',
  `name` varchar(100) NOT NULL COMMENT 'Tên ca (vd: Ca sáng, Ca chiều)',
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu ca',
  `end_time` time NOT NULL COMMENT 'Giờ kết thúc ca',
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  `is_default` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_shifts_store` (`store_id`),
  CONSTRAINT `fk_shift_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách ca làm việc theo cửa hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (73,155,'Ca Sáng','07:00:00','12:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(74,155,'Ca Chiều','13:00:00','18:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(75,155,'Ca Tối','18:00:00','22:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(76,156,'Ca Sáng','07:00:00','12:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(77,156,'Ca Chiều','13:00:00','18:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(78,156,'Ca Tối','18:00:00','22:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(79,157,'Ca Sáng','07:00:00','12:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(80,157,'Ca Chiều','13:00:00','18:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0'),(81,157,'Ca Tối','18:00:00','22:00:00','2026-03-11 08:50:30.000','2026-03-11 08:50:30.000',_binary '\0');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_request`
--

DROP TABLE IF EXISTS `stock_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `approved_at` datetime(6) DEFAULT NULL,
  `approved_by` bigint DEFAULT NULL,
  `cancel_reason` varchar(500) DEFAULT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `cancelled_by` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `exported_document_id` bigint DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `reject_reason` varchar(500) DEFAULT NULL,
  `rejected_at` datetime(6) DEFAULT NULL,
  `rejected_by` bigint DEFAULT NULL,
  `request_code` varchar(50) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED','EXPORTED') NOT NULL,
  `store_id` bigint NOT NULL,
  `target_warehouse_id` bigint NOT NULL,
  `source_warehouse_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_70nmtyc7e4e7o2imct3ggjj5n` (`request_code`),
  KEY `FKcr1y9myi7ayffmdbxsr52k49l` (`approved_by`),
  KEY `FKphchohq4wqnjslnfqb3dwpmcr` (`cancelled_by`),
  KEY `FK37iktp5alcfr7dc6s530rh61s` (`created_by`),
  KEY `FKkmj5ux2j6ajpjai4ky20envdn` (`exported_document_id`),
  KEY `FKblcuqptdsgi3t5wxdhc9vypc2` (`rejected_by`),
  KEY `FK48bti9w77mnmdc64wtx18q8ii` (`store_id`),
  KEY `FKb34l9xoajt9linuk7pmga5fx4` (`target_warehouse_id`),
  KEY `FKcbgrweylyqojbhslo2nv9cxwq` (`source_warehouse_id`),
  CONSTRAINT `FK37iktp5alcfr7dc6s530rh61s` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FK48bti9w77mnmdc64wtx18q8ii` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `FKb34l9xoajt9linuk7pmga5fx4` FOREIGN KEY (`target_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKblcuqptdsgi3t5wxdhc9vypc2` FOREIGN KEY (`rejected_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKcbgrweylyqojbhslo2nv9cxwq` FOREIGN KEY (`source_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKcr1y9myi7ayffmdbxsr52k49l` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkmj5ux2j6ajpjai4ky20envdn` FOREIGN KEY (`exported_document_id`) REFERENCES `inventory_document` (`id`),
  CONSTRAINT `FKphchohq4wqnjslnfqb3dwpmcr` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_request`
--

LOCK TABLES `stock_request` WRITE;
/*!40000 ALTER TABLE `stock_request` DISABLE KEYS */;
INSERT INTO `stock_request` VALUES (3,'2026-03-15 20:44:05.939853',109,NULL,NULL,NULL,'2026-03-15 20:42:12.652405',109,NULL,'Test request','NORMAL',NULL,NULL,NULL,'SR-20260315-001','EXPORTED',155,136,136),(4,NULL,NULL,NULL,NULL,NULL,'2026-03-15 20:44:14.319984',109,NULL,'Test reject','NORMAL','Khong du hang','2026-03-15 20:49:12.496935',109,'SR-20260315-002','REJECTED',155,136,136),(5,'2026-03-16 09:52:05.830912',109,NULL,NULL,NULL,'2026-03-16 08:42:43.880451',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-003','EXPORTED',156,138,136),(6,'2026-03-16 09:08:24.423782',109,NULL,NULL,NULL,'2026-03-16 08:45:41.030315',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-004','EXPORTED',156,138,136),(7,'2026-03-16 10:26:22.032133',109,NULL,NULL,NULL,'2026-03-16 10:25:56.077735',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-005','EXPORTED',156,138,136),(8,NULL,NULL,NULL,NULL,NULL,'2026-03-16 11:56:52.055290',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-006','PENDING',156,138,136),(9,'2026-03-16 11:57:56.556247',109,NULL,NULL,NULL,'2026-03-16 11:57:26.742800',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-007','EXPORTED',156,138,136),(10,'2026-03-16 14:26:46.498282',109,NULL,NULL,NULL,'2026-03-16 14:25:07.986583',120,NULL,'','NORMAL',NULL,NULL,NULL,'SR-20260316-008','EXPORTED',156,138,136);
/*!40000 ALTER TABLE `stock_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_request_item`
--

DROP TABLE IF EXISTS `stock_request_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_request_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note` varchar(200) DEFAULT NULL,
  `quantity` int NOT NULL,
  `stock_request_id` bigint NOT NULL,
  `variant_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa6b2tjpgjm3qw54i4km2kuyc1` (`stock_request_id`),
  KEY `FKmu7arim8wokxddfykroto0jar` (`variant_id`),
  CONSTRAINT `FKa6b2tjpgjm3qw54i4km2kuyc1` FOREIGN KEY (`stock_request_id`) REFERENCES `stock_request` (`id`),
  CONSTRAINT `FKmu7arim8wokxddfykroto0jar` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_request_item`
--

LOCK TABLES `stock_request_item` WRITE;
/*!40000 ALTER TABLE `stock_request_item` DISABLE KEYS */;
INSERT INTO `stock_request_item` VALUES (1,'T-shirt',5,3,186),(2,'Test',3,4,187),(3,'',1,5,199),(4,'',1,6,195),(5,'',5,7,187),(6,'',3,8,201),(7,'',4,9,196),(8,'',4,10,195);
/*!40000 ALTER TABLE `stock_request_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_warehouses`
--

DROP TABLE IF EXISTS `store_warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_warehouses` (
  `is_default` int NOT NULL,
  `store_id` bigint NOT NULL,
  `warehouse_id` bigint NOT NULL,
  PRIMARY KEY (`store_id`,`warehouse_id`),
  KEY `FK5ydfvl05chnnj2xlj5op45q8g` (`warehouse_id`),
  CONSTRAINT `FK5ydfvl05chnnj2xlj5op45q8g` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `FKrp1xac1t3ji63fkuva2flkllq` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_warehouses`
--

LOCK TABLES `store_warehouses` WRITE;
/*!40000 ALTER TABLE `store_warehouses` DISABLE KEYS */;
/*!40000 ALTER TABLE `store_warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID cửa hàng',
  `code` varchar(50) NOT NULL COMMENT 'Mã cửa hàng (duy nhất), dùng hiển thị/tra cứu (vd: HN-01)',
  `name` varchar(255) NOT NULL COMMENT 'Tên cửa hàng',
  `address` varchar(500) DEFAULT NULL COMMENT 'Địa chỉ cửa hàng',
  `status` int NOT NULL,
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật bản ghi gần nhất',
  `warehouse_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `fk_stores_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_stores_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách cửa hàng trong chuỗi';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (155,'STORE-001','Cửa Hàng 01 - Vincom','Lầu 3, Vincom Center, 72 Lê Thánh Tôn, Quận 1, TP Hồ Chí Minh',1,'2026-03-11 08:46:14.000','2026-03-11 08:46:14.000',137),(156,'STORE-002','Cửa Hàng 02 - District 7','Lầu 2, Crescent Mall, 101 Tôn Dật Tiên, Quận 7, TP Hồ Chí Minh',1,'2026-03-11 08:46:14.000','2026-03-11 08:46:14.000',138),(157,'STORE-003','Cửa Hàng 03 - Phú Nhuận','Lầu 1, Pandora City, 01 Nguyễn Oanh, Quận Phú Nhuận, TP Hồ Chí Minh',1,'2026-03-11 08:46:14.000','2026-03-11 08:46:14.000',139),(158,'ST1773208794909','Hùng','Viện Khoa học và Công nghệ Việt Nam – Hàn Quốc, Đường N15, Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',1,'2026-03-11 12:59:54.934','2026-03-11 12:59:54.934',NULL),(159,'ST1773222934062','Hùng stores','Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',1,'2026-03-11 16:55:34.121','2026-03-11 16:55:34.121',NULL),(160,'ST1773468388471','Vĩnh tường stores','Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',0,'2026-03-14 13:06:28.513','2026-03-14 13:07:10.230',142);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `status` int DEFAULT '1',
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách nhà cung cấp';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (76,'SUP-001','Công Ty TNHH Thời Trang Việt','0912345678','123 Lý Thường Kiệt, Quận 10, TP Hồ Chí Minh',1,'2026-03-11 08:48:29.943','2026-03-11 08:48:29.943'),(77,'SUP-002','Công Ty May Mặc Hàn Quốc','0923456789','456 Nguyễn Trãi, Quận 5, TP Hồ Chí Minh',1,'2026-03-11 08:48:29.943','2026-03-11 08:48:29.943'),(78,'SUP-003','Nike Vietnam Distributor','0934567890','789 Lê Lợi, Quận 1, TP Hồ Chí Minh',1,'2026-03-11 08:48:29.943','2026-03-11 08:48:29.943'),(79,'SUP-004','Adidas South East Asia','0945678901','321 Nguyễn Thị Minh Khai, Quận 3, TP Hồ Chí Minh',1,'2026-03-11 08:48:29.943','2026-03-11 08:48:29.943'),(80,'SUP-005','Công Ty Da Giày Thượng Hải','0956789012','654 Điện Biên Phủ, Quận Bình Thạnh, TP Hồ Chí Minh',1,'2026-03-11 08:48:29.943','2026-03-11 08:48:29.943');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL COMMENT 'FK -> users.id',
  `role_id` bigint NOT NULL COMMENT 'FK -> roles.id',
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_ur_role` (`role_id`),
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Mapping user - role (1 user có thể có nhiều role)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (109,72),(110,73),(113,73),(116,73),(120,73),(111,74),(112,74),(114,74),(115,74),(117,74),(118,74),(119,74),(121,74);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID người dùng',
  `store_id` bigint DEFAULT NULL COMMENT 'FK -> stores.id. Người dùng thuộc cửa hàng nào (Admin chuỗi có thể NULL)',
  `username` varchar(100) NOT NULL COMMENT 'Tên đăng nhập (duy nhất)',
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL COMMENT 'Họ tên',
  `phone` varchar(50) DEFAULT NULL COMMENT 'Số điện thoại',
  `email` varchar(255) DEFAULT NULL COMMENT 'Email',
  `status` int NOT NULL,
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật gần nhất',
  `created_by_user_id` bigint DEFAULT NULL,
  `region` enum('NORTH','CENTRAL','SOUTH') DEFAULT NULL,
  `warehouse_id` bigint DEFAULT NULL,
  `is_first_login` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_users_store` (`store_id`),
  KEY `idx_users_status` (`status`),
  CONSTRAINT `fk_user_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tài khoản người dùng hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (109,NULL,'admin','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','System Admin',NULL,'admin@retailchain.com',1,'2026-03-11 08:40:01.869','2026-03-11 08:40:01.869',NULL,NULL,NULL,_binary '\0'),(110,155,'manager01','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Nguyễn Thị Mỹ','0911222333','manager01@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',137,_binary '\0'),(111,155,'staff011','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Trần Văn Hùng','0911222444','staff011@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',137,_binary '\0'),(112,155,'staff012','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Lê Thị Hương','0911222555','staff012@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',137,_binary '\0'),(113,156,'manager02','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Phạm Văn Bảo','0912333444','manager02@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',138,_binary '\0'),(114,156,'staff021','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Ngô Thị Lan','0912333555','staff021@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',138,_binary '\0'),(115,156,'staff022','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Bùi Văn Đức','0912333666','staff022@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',138,_binary '\0'),(116,157,'manager03','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Vũ Thị Mai','0913444555','manager03@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',139,_binary '\0'),(117,157,'staff031','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Đỗ Văn Phong','0913444666','staff031@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',139,_binary '\0'),(118,157,'staff032','$2a$10$hPmxdmCkYCB.O/.CRdOa0uNYS6.qTtYYvI6pOJ39ClYMcV8UfP01C','Hoàng Thị Ngọc','0913444777','staff032@retailchain.com',1,'2026-03-11 08:50:53.000','2026-03-11 08:50:53.000',109,'SOUTH',139,_binary '\0'),(119,NULL,'admin@test.com','$2a$10$aakoqSUmZCmvWx2n4iN.Y.n/EkB2uJ5IOEIp8cpwejBDypH9c.bNC','Admin Test',NULL,'admin@test.com',1,'2026-03-12 15:36:20.617','2026-03-12 15:36:20.617',NULL,NULL,NULL,_binary '\0'),(120,156,'hungpx','$2a$10$aN5NKAEF4UwHdBEsi8RN7eAZv4lscdBRW2jFBrkefiH793H3AnTPm','Phạm Xuân Hùng','0377509183','hungbeoku@gmail.com',1,'2026-03-14 13:27:15.988','2026-03-15 20:54:43.757',109,NULL,NULL,_binary '\0'),(121,156,'hung01','$2a$10$Twnk7eMJYQaKVYAhj9wKL.gdsFahju.KNNCGs.ty.VVY0CkM1VzQC','Phạm Xuân Hùng','','xuanhung061204@gmail.com',1,'2026-03-14 13:33:37.541','2026-03-14 13:33:37.541',109,NULL,NULL,_binary '\0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouses`
--

DROP TABLE IF EXISTS `warehouses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouses` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'PK. ID kho',
  `code` varchar(50) NOT NULL COMMENT 'Mã kho (duy nhất), dùng hiển thị/tra cứu',
  `name` varchar(255) NOT NULL COMMENT 'Tên kho',
  `status` int NOT NULL,
  `created_at` datetime(3) NOT NULL COMMENT 'Thời điểm tạo bản ghi',
  `updated_at` datetime(3) NOT NULL COMMENT 'Thời điểm cập nhật bản ghi gần nhất',
  `address` varchar(500) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `description` text,
  `is_central` int DEFAULT NULL,
  `is_default` int DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `warehouse_level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách kho (kho tổng và kho cửa hàng)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouses`
--

LOCK TABLES `warehouses` WRITE;
/*!40000 ALTER TABLE `warehouses` DISABLE KEYS */;
INSERT INTO `warehouses` VALUES (136,'WH-CENTRAL','Kho Tổng Hà Nội',1,'2026-03-11 08:45:38.000','2026-03-11 08:45:38.000','123 Đường Nguyễn Trãi, Quận 1','Hà Nội','Quận 1','Phường 1','Nguyễn Văn A','0912345678','Kho tổng trung ương - phục vụ toàn hệ thống',1,NULL,NULL,NULL),(137,'WH-STORE-001','Kho Cửa Hàng 01 - Vincom',1,'2026-03-11 08:45:55.000','2026-03-11 08:45:55.000','Lầu 3, Vincom Center, 72 Lê Thánh Tôn, Quận 1','TP Hồ Chí Minh','Quận 1','Phường Bến Nghé','Trần Thị B','0923456789','Kho cửa hàng 01 - Quận 1',0,NULL,NULL,NULL),(138,'WH-STORE-002','Kho Cửa Hàng 02 - District 7',1,'2026-03-11 08:45:55.000','2026-03-11 08:45:55.000','Lầu 2, Crescent Mall, 101 Tôn Dật Tiên, Quận 7','TP Hồ Chí Minh','Quận 7','Phường Tân Phú','Lê Văn C','0934567890','Kho cửa hàng 02 - Quận 7',0,NULL,NULL,NULL),(139,'WH-STORE-003','Kho Cửa Hàng 03 - Phú Nhuận',1,'2026-03-11 08:45:55.000','2026-03-11 08:45:55.000','Lầu 1, Pandora City, 01 Nguyễn Oanh, Quận Phú Nhuận','TP Hồ Chí Minh','Quận Phú Nhuận','Phường 17','Phạm Văn D','0945678901','Kho cửa hàng 03 - Phú Nhuận',0,NULL,NULL,NULL),(140,'WH_ST1773208794909','Kho Hùng',1,'2026-03-11 12:59:54.918','2026-03-11 12:59:54.918','Viện Khoa học và Công nghệ Việt Nam – Hàn Quốc, Đường N15, Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(141,'WH_ST1773222934062','Kho Hùng stores',1,'2026-03-11 16:55:34.076','2026-03-11 16:55:34.076','Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL),(142,'WH_ST1773468388471','Kho Vĩnh tường stores',1,'2026-03-14 13:06:28.476','2026-03-14 13:06:28.476','Viện Khoa học và Công nghệ Việt Nam – Hàn Quốc, Đường N15, Hoa Lac Hi-Tech Park, Hoa Lac Commune, Hà Nội, Vietnam',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `warehouses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'retail_chain'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

--
-- Re-enable FK checks after import
--
SET FOREIGN_KEY_CHECKS = 1;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-16 14:51:52
