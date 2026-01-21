import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentOrdersTable = () => {
  return (
    <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex-1">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border-light dark:border-border-dark space-y-0">
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Sales Orders</CardTitle>
        <a className="text-sm text-primary font-semibold hover:text-primary-dark hover:underline cursor-pointer">View All</a>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-b border-border-light dark:border-border-dark">
              <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Order ID</TableHead>
              <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Customer</TableHead>
              <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Amount</TableHead>
              <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border-light dark:divide-border-dark">
            <TableRow className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
              <TableCell className="px-6 py-3 text-sm font-medium text-primary">#ORD-0294</TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">AS</span>
                  Alex S.
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">$124.50</TableCell>
              <TableCell className="px-6 py-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-400 font-mono">10:42 AM</TableCell>
            </TableRow>

            <TableRow className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
              <TableCell className="px-6 py-3 text-sm font-medium text-primary">#ORD-0293</TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-[10px] font-bold text-pink-700 dark:text-pink-300">ML</span>
                  Maria L.
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">$54.00</TableCell>
              <TableCell className="px-6 py-3">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 border-none shadow-none text-xs">
                  Processing
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-400 font-mono">10:38 AM</TableCell>
            </TableRow>

            <TableRow className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
              <TableCell className="px-6 py-3 text-sm font-medium text-primary">#ORD-0292</TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">JD</span>
                  John D.
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">$210.20</TableCell>
              <TableCell className="px-6 py-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 border-none shadow-none text-xs">
                  Completed
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-400 font-mono">10:15 AM</TableCell>
            </TableRow>

            <TableRow className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
              <TableCell className="px-6 py-3 text-sm font-medium text-primary">#ORD-0291</TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-[10px] font-bold text-purple-700 dark:text-purple-300">RW</span>
                  Robert W.
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">$85.00</TableCell>
              <TableCell className="px-6 py-3">
                <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-100 border-none shadow-none text-xs">
                  Pending
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-3 text-sm text-slate-400 font-mono">09:55 AM</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;
