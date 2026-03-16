// src/pages/Product/ProductCategoryPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Search, Tag, Package,
  AlertTriangle, WifiOff, X, Loader2, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import productService from "../../services/product.service";
import useAuth from "../../contexts/AuthContext/useAuth";

// ====================== Delete Confirm Dialog ======================
const DeleteConfirmDialog = ({ category, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-[#1a262a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Xóa danh mục</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Hành động này không thể hoàn tác</p>
        </div>
      </div>

      <p className="text-slate-700 dark:text-slate-300 mb-2">
        Bạn có chắc muốn xóa danh mục{" "}
        <span className="font-bold text-slate-900 dark:text-white">
          &ldquo;{category?.name}&rdquo;
        </span>
        ?
      </p>

      {(category?.productCount || 0) > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm mb-4">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Danh mục đang có <strong>{category.productCount}</strong> sản phẩm, không thể xóa!</span>
        </div>
      )}

      <div className="flex gap-3 justify-end mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-slate-300 dark:border-slate-700"
        >
          Hủy
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={loading || (category?.productCount || 0) > 0}
          className="gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Xóa
        </Button>
      </div>
    </div>
  </div>
);

// ====================== Category Form Modal ======================
const CategoryFormModal = ({ category, onSave, onClose, loading }) => {
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Tên danh mục không được để trống");
      return;
    }
    if (trimmed.length > 255) {
      setError("Tên danh mục không được vượt quá 255 ký tự");
      return;
    }
    setError("");
    onSave({ name: trimmed });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-[#1a262a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tag className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {category ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              id="category-name-input"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Nhập tên danh mục..."
              autoFocus
              className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                error
                  ? "border-red-400 focus:ring-red-400/50"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-slate-300 dark:border-slate-700"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 shadow-md shadow-primary/20">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {category ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====================== Main Page ======================
const ProductCategoryPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission("PRODUCT_CREATE");
  const canUpdate = hasPermission("PRODUCT_UPDATE");
  const canDelete = hasPermission("PRODUCT_DELETE");

  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [backendOffline, setBackendOffline] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formModal, setFormModal] = useState({ open: false, category: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getCategories();
      const data = res.data || [];
      setCategories(data);
      setFiltered(data);
      setBackendOffline(false);
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
      setBackendOffline(true);
      setCategories([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(categories);
    } else {
      const q = search.toLowerCase();
      setFiltered(categories.filter((c) => c.name?.toLowerCase().includes(q)));
    }
  }, [search, categories]);

  const handleCreate = () => setFormModal({ open: true, category: null });
  const handleEdit = (cat) => setFormModal({ open: true, category: cat });
  const handleDeleteClick = (cat) => setDeleteModal({ open: true, category: cat });

  const handleFormSave = async (data) => {
    setActionLoading(true);
    try {
      if (formModal.category) {
        await productService.updateCategory(formModal.category.id, data);
        toast.success(`Đã cập nhật danh mục "${data.name}"`);
      } else {
        await productService.createCategory(data);
        toast.success(`Đã thêm danh mục "${data.name}"`);
      }
      setFormModal({ open: false, category: null });
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.category) return;
    setActionLoading(true);
    try {
      await productService.deleteCategory(deleteModal.category.id);
      toast.success(`Đã xóa danh mục "${deleteModal.category.name}"`);
      setDeleteModal({ open: false, category: null });
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Không thể xóa danh mục";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] dark:bg-[#0f171a] min-h-screen">

      {/* Backend offline banner */}
      {backendOffline && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
          <WifiOff className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Backend không khả dụng</span>
            <span className="ml-2 text-sm">— Hãy khởi động Spring Boot server để xem dữ liệu thực.</span>
          </div>
          <AlertTriangle className="w-4 h-4 shrink-0" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">
              Quản lý danh mục
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Tạo và quản lý danh mục sản phẩm trong hệ thống
            </p>
          </div>
        </div>

        {canCreate && (
          <Button
            id="btn-add-category"
            onClick={handleCreate}
            className="h-11 px-5 gap-2 font-bold shadow-md shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Thêm danh mục
          </Button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="category-search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm danh mục..."
          className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a262a] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Category Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a262a] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-medium">Đang tải danh mục...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="w-16 px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">#</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Tên danh mục</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-center">Số sản phẩm</TableHead>
                {(canUpdate || canDelete) && (
                  <TableHead className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Thao tác</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map((cat, index) => (
                  <TableRow
                    key={cat.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group border-b border-slate-200 dark:border-slate-800"
                  >
                    <TableCell className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500 font-mono">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold text-sm">
                          {cat.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge
                        className={
                          (cat.productCount || 0) > 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                        }
                      >
                        <Package className="w-3 h-3 mr-1" />
                        {cat.productCount || 0} sản phẩm
                      </Badge>
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canUpdate && (
                            <Button
                              id={`btn-edit-category-${cat.id}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10"
                              onClick={() => handleEdit(cat)}
                              title="Sửa danh mục"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              id={`btn-delete-category-${cat.id}`}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDeleteClick(cat)}
                              title="Xóa danh mục"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={(canUpdate || canDelete) ? 4 : 3}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Tag className="w-8 h-8 opacity-30" />
                      <p className="font-medium">
                        {search
                          ? `Không tìm thấy kết quả cho "${search}"`
                          : "Chưa có danh mục nào"}
                      </p>
                      {canCreate && !search && (
                        <button
                          onClick={handleCreate}
                          className="text-sm text-primary hover:underline"
                        >
                          + Thêm danh mục đầu tiên
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Footer summary */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Hiển thị <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> / <span className="font-bold text-slate-900 dark:text-white">{categories.length}</span> danh mục
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Tổng <span className="font-bold text-slate-900 dark:text-white">
                {categories.reduce((acc, c) => acc + (c.productCount || 0), 0)}
              </span> sản phẩm
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {formModal.open && (
        <CategoryFormModal
          category={formModal.category}
          onSave={handleFormSave}
          onClose={() => setFormModal({ open: false, category: null })}
          loading={actionLoading}
        />
      )}

      {deleteModal.open && (
        <DeleteConfirmDialog
          category={deleteModal.category}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ open: false, category: null })}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default ProductCategoryPage;
