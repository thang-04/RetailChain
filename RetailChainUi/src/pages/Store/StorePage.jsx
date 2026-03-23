import React, { useEffect, useState } from "react";
import { Plus, Store, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoreFilter from "./components/StoreFilter";
import StoreList from "./components/StoreList";
import AddStoreModal from "./components/AddStoreModal";
import useAuth from "../../contexts/AuthContext/useAuth";
import storeService from "../../services/store.service";

const StorePage = () => {
  const { hasPermission } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Filter Logic
  const filteredStores = React.useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = 
        store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.manager?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || store.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, statusFilter]);

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleStoreAdded = (newStore) => {
    setStores(prevStores => [...prevStores, newStore]);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = filteredStores.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination buttons
  const getPaginationGroup = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    // Xử lý góc edge-cases khi đang ở đầu/cuối để luôn hiển thị 3 trang nếu có
    if (currentPage === 1) end = Math.min(3, totalPages);
    if (currentPage === totalPages) start = Math.max(1, totalPages - 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6 min-h-full">
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="sr-only">Quản lý cửa hàng</h1>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Quản lý cửa hàng
              </h2>
            </div>
            {hasPermission('STORE_CREATE') && (
              <Button
                className="gap-2 shadow-sm shadow-primary/30 hover:translate-y-[-1px] transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-5 h-5" />
                <span>Thêm cửa hàng</span>
              </Button>
            )}
          </div>

          {/* Filter Bar */}
          <StoreFilter 
            search={searchQuery}
            onSearchChange={setSearchQuery}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Store List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-lg font-medium text-slate-500 dark:text-slate-400">Đang tải danh sách cửa hàng...</div>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a262a] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 group hover:border-primary/50 transition-all duration-300">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Chưa có cửa hàng nào</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm px-4">
                {searchQuery || statusFilter !== 'all' 
                  ? "Không tìm thấy cửa hàng nào khớp với tiêu chí lọc."
                  : "Hiện tại hệ thống chưa ghi nhận cửa hàng nào. Hãy thêm cửa hàng đầu tiên để bắt đầu quản lý."
                }
              </p>
              {!searchQuery && statusFilter === 'all' && hasPermission('STORE_CREATE') && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="gap-2 h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Plus className="w-5 h-5 font-bold" />
                  <span>Thêm Cửa Hàng Ngay</span>
                </Button>
              )}
            </div>
          ) : (
            <StoreList stores={currentStores} />
          )}

          {/* Pagination - Optimized UI/UX */}
          {!loading && filteredStores.length > 0 && (
            <div className="mt-auto bg-card border border-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4 transition-all">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Hiển thị <span className="font-bold text-slate-900 dark:text-white px-1">{startIndex + 1}-{Math.min(endIndex, filteredStores.length)}</span> trên <span className="font-bold text-slate-900 dark:text-white px-1">{filteredStores.length}</span> cơ sở
              </p>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 px-4 text-slate-600 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:bg-transparent rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {/* Luôn hiện trang 1 */}
                    {getPaginationGroup()[0] > 1 && (
                      <>
                        <Button
                          onClick={() => handlePageChange(1)}
                          className={`size-10 p-0 rounded-xl font-bold transition-all ${currentPage === 1 ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          variant={currentPage === 1 ? "default" : "ghost"}
                        >
                          1
                        </Button>
                        {getPaginationGroup()[0] > 2 && <span className="px-2 text-slate-400">...</span>}
                      </>
                    )}

                    {/* Vòng lặp các trang ở giữa */}
                    {getPaginationGroup().map((item) => (
                      <Button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`size-10 p-0 rounded-xl font-bold transition-all ${currentPage === item ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        variant={currentPage === item ? "default" : "ghost"}
                      >
                        {item}
                      </Button>
                    ))}

                    {/* Luôn hiện trang cuối */}
                    {getPaginationGroup()[getPaginationGroup().length - 1] < totalPages && (
                      <>
                        {getPaginationGroup()[getPaginationGroup().length - 1] < totalPages - 1 && <span className="px-2 text-slate-400">...</span>}
                        <Button
                          onClick={() => handlePageChange(totalPages)}
                          className={`size-10 p-0 rounded-xl font-bold transition-all ${currentPage === totalPages ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          variant={currentPage === totalPages ? "default" : "ghost"}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 px-4 text-slate-600 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:bg-transparent rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    Tiếp
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoreAdded={handleStoreAdded}
      />
    </div>
  );
};

export default StorePage;
