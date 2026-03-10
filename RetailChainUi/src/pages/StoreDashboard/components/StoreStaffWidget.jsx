import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "react-router-dom";

const StoreStaffWidget = ({ staff }) => {
    const { id } = useParams();

    const staffList = staff && staff.length > 0 ? staff : [];

    return (
        <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm overflow-hidden flex-1">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border-light dark:border-border-dark space-y-0">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Store Staff</CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full border-none shadow-none">
                        {staffList.length} Active
                    </Badge>
                </div>
                <Link to={`/store/${id}/staff`} className="text-sm text-primary font-semibold hover:text-primary-dark hover:underline cursor-pointer">
                    View All
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <TableRow className="hover:bg-transparent border-b border-border-light dark:border-border-dark">
                            <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Employee</TableHead>
                            <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider">Role</TableHead>
                            <TableHead className="px-4 py-3 text-xs uppercase text-slate-500 font-semibold tracking-wider text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border-light dark:divide-border-dark">
                        {staffList.length > 0 ? (
                            staffList.slice(0, 5).map((person, index) => (
                                <TableRow key={index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-none">
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {person.image ? (
                                                <div className="size-8 rounded-full bg-cover bg-center shrink-0 border border-slate-100 dark:border-slate-700" style={{ backgroundImage: `url("${person.image}")` }}></div>
                                            ) : (
                                                <div className={`flex items-center justify-center size-8 rounded-full text-xs font-bold shrink-0 border ${person.initialsColor}`}>{person.initials}</div>
                                            )}
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{person.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3">
                                        <span className="text-xs text-slate-500 font-medium">{person.role}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${person.statusColor} ml-auto`}>
                                            <span className={`size-1.5 rounded-full ${person.dotColor}`}></span>
                                            {person.status}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4 text-slate-500">
                                    No staff data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default StoreStaffWidget;
