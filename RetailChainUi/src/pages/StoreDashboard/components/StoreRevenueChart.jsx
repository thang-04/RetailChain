import { Card, CardContent } from "@/components/ui/card";

const StoreRevenueChart = () => {
  return (
    <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Store Revenue Over Time</h3>
            <div className="flex items-center gap-2 mt-1">
              <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">$24,500</h4>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">+8.5%</span>
              <span className="text-sm text-slate-500">vs last 7 days</span>
            </div>
          </div>
          {/* Simple Custom Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-slate-600 dark:text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-dashed border-slate-300"></span>
              <span className="text-slate-400">Projection</span>
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
            <path d="M0,200 Q142,150 285,180 T571,100 T857,120 T1000,60 V250 H0 Z" fill="url(#chartGradient)"></path>
            {/* Line */}
            <path d="M0,200 Q142,150 285,180 T571,100 T857,120 T1000,60" fill="none" stroke="#24748f" strokeLinecap="round" strokeWidth="3"></path>
            {/* Data Points */}
            <circle cx="285" cy="180" fill="#ffffff" r="4" stroke="#24748f" strokeWidth="2"></circle>
            <circle cx="571" cy="100" fill="#ffffff" r="4" stroke="#24748f" strokeWidth="2"></circle>
            <circle cx="857" cy="120" fill="#ffffff" r="4" stroke="#24748f" strokeWidth="2"></circle>
            <circle cx="1000" cy="60" fill="#24748f" r="6" stroke="#fff" strokeWidth="2"></circle>
          </svg>
          {/* X Axis Labels */}
          <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 uppercase tracking-wide px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreRevenueChart;
