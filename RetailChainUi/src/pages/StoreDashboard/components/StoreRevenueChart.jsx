import { Card, CardContent } from "@/components/ui/card";

const StoreRevenueChart = ({ data = [] }) => {
  // Use data or fallback to a default zero-state array
  const chartData = data && data.length > 0 ? data : Array(7).fill({ label: "-", amount: 0 });

  // Calculate max value for scaling
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1000);
  // Add a 20% buffer to the max amount so the chart doesn't touch the top
  const yAxisMax = maxAmount * 1.2;

  // Total revenue sum
  const totalRevenue = chartData.reduce((sum, item) => sum + item.amount, 0);

  // SVG dimensions
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 300;
  const PADDING_TOP = 50;
  const PADDING_BOTTOM = 250; // The Y coordinate where value = 0

  // Calculate coordinates
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * SVG_WIDTH;
    // value 0 -> PADDING_BOTTOM, value yAxisMax -> PADDING_TOP
    const y = PADDING_BOTTOM - (d.amount / yAxisMax) * (PADDING_BOTTOM - PADDING_TOP);
    return { x, y, label: d.label, amount: d.amount };
  });

  // Generate paths (using simple lines instead of bezier curves for reliability with dynamic data)
  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const fillPath = `${linePath} L${SVG_WIDTH},${PADDING_BOTTOM} L0,${PADDING_BOTTOM} Z`;

  return (
    <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Doanh thu cửa hàng theo thời gian (7 ngày)</h3>
            <div className="flex items-center gap-2 mt-1">
              <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalRevenue.toLocaleString()} VND
              </h4>
              {/* Fixed badge for now, can be calculated against previous 7 days if API provides it */}
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Đang hoạt động</span>
            </div>
          </div>
          {/* Simple Custom Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-slate-600 dark:text-slate-300">Doanh thu</span>
            </div>
          </div>
        </div>
        {/* Chart SVG Visualization */}
        <div className="w-full h-64 relative">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#24748f" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#24748f" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
            <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="175" y2="175"></line>
            <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100"></line>
            <line className="dark:stroke-slate-700" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="25" y2="25"></line>
            {/* Area Fill */}
            <path d={fillPath} fill="url(#chartGradient)"></path>
            {/* Line */}
            <path d={linePath} fill="none" stroke="#24748f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            {/* Data Points */}
            {points.map((p, i) => (
              <circle key={`point-${i}`} cx={p.x} cy={p.y} fill={i === points.length - 1 ? "#24748f" : "#ffffff"} r={i === points.length - 1 ? "6" : "4"} stroke={i === points.length - 1 ? "#fff" : "#24748f"} strokeWidth="2"></circle>
            ))}
          </svg>
          {/* X Axis Labels */}
          <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 uppercase tracking-wide px-2">
            {points.map((p, i) => (
              <span key={`label-${i}`}>{p.label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreRevenueChart;
