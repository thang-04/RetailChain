// src/pages/Inventory/InventoryDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import inventoryService from "../../services/inventory.service";
import useAuth from "../../contexts/AuthContext/useAuth";

const InventoryDetailPage = () => {
  const { inventoryId } = useParams();
  const navigate = useNavigate();
  const { hasPermission, isSuperAdmin, isStoreManager } = useAuth();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editQuantity, setEditQuantity] = useState("");
  const [editReason, setEditReason] = useState("");
  const [saving, setSaving] = useState(false);

  const canEdit =
    hasPermission("INVENTORY_UPDATE") || isSuperAdmin() || isStoreManager();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await inventoryService.getInventoryDetail(inventoryId);
        setDetail(data);
        setEditQuantity(
          typeof data?.quantity === "number" ? String(data.quantity) : ""
        );
      } catch (err) {
        console.error("Failed to load inventory detail:", err);
        setError(err?.message || "Không tải được chi tiết tồn kho.");
      } finally {
        setLoading(false);
      }
    };

    if (inventoryId) {
      fetchDetail();
    }
  }, [inventoryId]);

  const handleSave = async () => {
    const quantityNumber = Number(editQuantity);
    if (Number.isNaN(quantityNumber) || quantityNumber < 0) {
      alert("Số lượng phải là số không âm.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await inventoryService.updateInventoryQuantity(inventoryId, {
        quantity: quantityNumber,
        reason: editReason,
      });
      const refreshed = await inventoryService.getInventoryDetail(inventoryId);
      setDetail(refreshed);
      setEditQuantity(
        typeof refreshed?.quantity === "number" ? String(refreshed.quantity) : ""
      );
      setEditReason("");
    } catch (err) {
      console.error("Failed to update inventory quantity:", err);
      setError(err?.message || "Không thể cập nhật tồn kho.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto py-10">
        <p className="text-center text-slate-500">Đang tải chi tiết tồn kho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[900px] mx-auto py-10">
        <p className="text-center text-red-600">{error}</p>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-[900px] mx-auto py-10">
        <p className="text-center text-slate-500">Không tìm thấy bản ghi tồn kho.</p>
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Chi tiết tồn kho
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kiểm tra và điều chỉnh tồn kho cho từng biến thể sản phẩm tại cửa hàng.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>

      <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Sản phẩm</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.productName ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">SKU</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.sku ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Phiên bản</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.variantName ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Cửa hàng</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.storeName ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Kho</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.warehouseName ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Số lượng hiện tại</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.quantity ?? 0}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Lần cập nhật gần nhất</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {detail.lastUpdated
                ? new Date(detail.lastUpdated).toLocaleString("vi-VN")
                : "—"}
            </p>
          </div>
        </div>
      </Card>

      {/* {canEdit && (
        <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Điều chỉnh tồn kho
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Số lượng mới</p>
              <Input
                type="number"
                min={0}
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Lý do điều chỉnh</p>
              <Textarea
                rows={3}
                placeholder="Ví dụ: Kiểm kê chênh lệch, hủy hàng hỏng..."
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="min-w-[140px]"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu điều chỉnh"}
            </Button>
          </div>
        </Card>
      )} */}
    </div>
  );
};

export default InventoryDetailPage;

