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

const RecentOrdersTable = ({ orders }) => {
  // Use mock default if no orders provided
  const orderList = orders || [
    { id: "ORD-0294", customer: "Alex S.", amount: "$124.50", status: "Completed", time: "10:42 AM", avatar: "AS", color: "bg-slate-200" },
    { id: "ORD-0293", customer: "Maria L.", amount: "$54.00", status: "Processing", time: "10:38 AM", avatar: "ML", color: "bg-pink-100" },
    { id: "ORD-0292", customer: "John D.", amount: "$210.20", status: "Completed", time: "10:15 AM", avatar: "JD", color: "bg-indigo-100" },
    { id: "ORD-0291", customer: "Robert W.", amount: "$85.00", status: "Pending", time: "09:55 AM", avatar: "RW", color: "bg-purple-100" },
  ];

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
            {orderList.map((order) => (
              <TableRow key={order.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-none">
                <TableCell className="px-6 py-3 text-sm font-medium text-primary">#{order.id}</TableCell>
                <TableCell className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full ${order.color || 'bg-slate-200'} flex items-center justify-center text-[10px] font-bold`}>
                      {order.avatar || 'US'}
                    </span>
                    {order.customer}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">{order.amount || order.total}</TableCell>
                <TableCell className="px-6 py-3">
                  <Badge variant="secondary" className={`border-none shadow-none text-xs ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-3 text-sm text-slate-400 font-mono">{order.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;

