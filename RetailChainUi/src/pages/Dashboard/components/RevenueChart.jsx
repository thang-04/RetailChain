import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RevenueChart = ({ data, timeRange, onTimeRangeChange }) => {
  const series = Array.isArray(data) ? data : [];
  const amounts = series.map((d) => (typeof d?.amount === "number" ? d.amount : 0));
  const max = Math.max(0, ...amounts);
  const dataMin = amounts.length > 0 ? Math.min(...amounts) : 0;
  const min = Math.min(0, dataMin);

  const formatMoneyShort = (n) => {
    if (typeof n !== "number") return "0";
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return new Intl.NumberFormat("vi-VN").format(n);
  };

  const buildPath = () => {
    if (series.length < 2) return { line: "", area: "" };
    const n = series.length;
    const w = 100;
    const h = 50;
    const padTop = 5;
    const padBottom = 45;
    const yMin = Math.min(min, 0);
    const yMax = max === min ? Math.max(1, max + 1) : max;

    const points = series.map((d, i) => {
      const x = (w * i) / (n - 1);
      const v = typeof d?.amount === "number" ? d.amount : 0;
      const t = (v - yMin) / (yMax - yMin);
      const y = padBottom - t * (padBottom - padTop);
      return { x, y };
    });

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(" ");

    const area =
      line +
      ` L${w},${h} L0,${h} Z`;

    return { line, area, points };
  };

  const { line, area } = buildPath();

  const yLabels = [
    max,
    max * 0.75,
    max * 0.5,
    max * 0.25,
    0,
  ].map((v) => formatMoneyShort(Math.round(v)));

  const xLabelAt = (idx) => {
    const d = series[idx];
    if (!d?.label) return "";
    // label dạng yyyy-MM-dd -> hiển thị dd/MM
    const parts = String(d.label).split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return String(d.label);
  };

  const xLabelIdxs = series.length >= 4
    ? [0, Math.floor((series.length - 1) / 3), Math.floor(((series.length - 1) * 2) / 3), series.length - 1]
    : series.map((_, i) => i);

  return (
    <Card className="lg:col-span-2 shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
        <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Hiệu suất thời gian thực</CardTitle>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 dark:bg-gray-800 border-none shadow-none">
            <SelectValue placeholder="Kỳ xem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">30 ngày</SelectItem>
            <SelectItem value="quarter">Quý gần nhất</SelectItem>
            <SelectItem value="ytd">Từ đầu năm đến nay</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <div className="w-full relative min-h-[300px] chart-grid rounded-md overflow-hidden p-4">
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-text-muted opacity-50 pointer-events-none pb-8">
            {yLabels.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
          {/* The Chart Line (SVG) */}
          <svg className="absolute inset-0 w-full h-full pb-8 pl-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#24748f" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#24748f" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            {line ? (
              <>
                <path
                  d={line}
                  fill="none"
                  stroke="#24748f"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path d={area} fill="url(#gradient)" stroke="none"></path>
              </>
            ) : (
              <text x="50" y="25" textAnchor="middle" fill="#94a3b8" fontSize="4">
                Chưa có dữ liệu
              </text>
            )}
          </svg>
          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-text-muted pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
            {xLabelIdxs.map((idx) => (
              <span key={idx}>{xLabelAt(idx)}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

