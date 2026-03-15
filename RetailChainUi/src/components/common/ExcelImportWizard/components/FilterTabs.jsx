import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "valid", label: "Hợp lệ" },
  { id: "invalid", label: "Lỗi" },
  { id: "new", label: "Mới" },
];

const FilterTabs = ({ activeTab, onTabChange, stats }) => {
  const getCount = (tabId) => {
    switch (tabId) {
      case "all":
        return stats.total;
      case "valid":
        return stats.valid;
      case "invalid":
        return stats.invalid;
      case "new":
        return stats.newProduct;
      default:
        return 0;
    }
  };

  return (
    <div className="flex gap-2 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tab.label}
          <span className="ml-1 text-xs opacity-70">({getCount(tab.id)})</span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
