import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RevenueChart = () => {
    return (
      <Card className="lg:col-span-2 shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Revenue Over Time</CardTitle>
          <Select defaultValue="30days">
            <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 dark:bg-gray-800 border-none shadow-none">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="w-full relative min-h-[300px] chart-grid rounded-md overflow-hidden p-4">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-text-muted opacity-50 pointer-events-none pb-8">
              <span>$200k</span>
              <span>$150k</span>
              <span>$100k</span>
              <span>$50k</span>
              <span>$0</span>
            </div>
            {/* The Chart Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full pb-8 pl-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#24748f" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#24748f" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,45 L10,40 L20,42 L30,30 L40,35 L50,20 L60,25 L70,15 L80,18 L90,10 L100,5" fill="none" stroke="#24748f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
              <path d="M0,45 L10,40 L20,42 L30,30 L40,35 L50,20 L60,25 L70,15 L80,18 L90,10 L100,5 L100,50 L0,50 Z" fill="url(#gradient)" stroke="none"></path>
              {/* Tooltip Point Simulation */}
              <circle className="group-hover:opacity-100 transition-opacity" cx="70" cy="15" fill="#fff" r="1.5" stroke="#24748f" strokeWidth="0.5"></circle>
            </svg>
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-text-muted pt-2 border-t border-dashed border-gray-300 dark:border-gray-600">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default RevenueChart;
