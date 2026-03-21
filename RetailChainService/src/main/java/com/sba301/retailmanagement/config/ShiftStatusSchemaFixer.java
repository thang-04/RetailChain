package com.sba301.retailmanagement.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShiftStatusSchemaFixer implements CommandLineRunner {

    private static final String STATUS_COLUMN_QUERY = """
            SELECT DATA_TYPE AS dataType, COLUMN_TYPE AS columnType
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'shift_assignments'
              AND COLUMN_NAME = 'status'
            """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            Map<String, Object> row = jdbcTemplate.queryForMap(STATUS_COLUMN_QUERY);
            String dataType = row.get("dataType") != null ? String.valueOf(row.get("dataType")).toLowerCase() : "";
            String columnType = row.get("columnType") != null ? String.valueOf(row.get("columnType")) : "";

            if (!"enum".equals(dataType)) {
                return;
            }

            String lowerColumnType = columnType.toLowerCase();
            if (lowerColumnType.contains("'draft'")) {
                return;
            }

            String mergedEnumValues = mergeEnumValues(columnType, "DRAFT");
            if (mergedEnumValues == null || mergedEnumValues.isBlank()) {
                log.warn("Bo qua cap nhat schema shift_assignments.status vi khong parse duoc ENUM: {}", columnType);
                return;
            }

            String alterSql = "ALTER TABLE shift_assignments MODIFY COLUMN status ENUM(" + mergedEnumValues + ") NOT NULL";
            jdbcTemplate.execute(alterSql);
            log.info("Da cap nhat schema: them 'DRAFT' vao ENUM shift_assignments.status");
        } catch (EmptyResultDataAccessException ex) {
            log.warn("Khong tim thay cot shift_assignments.status de cap nhat schema");
        } catch (Exception ex) {
            log.error("Khong the cap nhat schema shift_assignments.status: {}", ex.getMessage(), ex);
        }
    }

    private String mergeEnumValues(String columnType, String requiredValue) {
        if (columnType == null) return null;
        String normalized = columnType.trim();
        if (!normalized.toLowerCase().startsWith("enum(") || !normalized.endsWith(")")) {
            return null;
        }

        String inside = normalized.substring(normalized.indexOf('(') + 1, normalized.length() - 1).trim();
        Set<String> values = new LinkedHashSet<>();
        if (!inside.isEmpty()) {
            String[] parts = inside.split(",");
            for (String part : parts) {
                String token = part.trim();
                if (!token.isEmpty()) {
                    values.add(token);
                }
            }
        }

        values.add("'" + requiredValue + "'");
        return values.stream().collect(Collectors.joining(","));
    }
}
