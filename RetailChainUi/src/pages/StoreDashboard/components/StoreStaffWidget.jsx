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

    // Use mock default if no staff provided, matching the full page data structure where possible
    const staffList = staff || [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Store Manager",
            status: "Active",
            statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
            dotColor: "bg-emerald-500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl32EiV1Cebqa_bpYzpzkBbcGFF7jsfVvdcyGwELL3icwWL-bHEY-vvjlZBbETn4yJHLTd0mlZXULn9VYSftCxIumz9g1Z3s0pn9NbvAs-hhuNAsMgLofsRR0c-xOqf9R0fl4859vT99WzRr1SU1h6x2Gr7sxYqB0xF5V3IZN82iDIJdT1PnC6AxYh1gGxRtIV76JI88pmokhGKX-nU3eYiDxkyoySRf69bFEOg1zjo1IfH0wkaDFX5TAdhicbGk3JxKDW05TpnF4"
        },
        {
            id: 2,
            name: "Michael Ross",
            role: "Sales Associate",
            status: "On Leave",
            statusColor: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30",
            dotColor: "bg-amber-500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxsnr80ZOP5BAXuopRtLfnFvy2BwFVog_oaGAB4sijHA1C240nQhUVSCIU9ace3HuxY6cHdLO517wFQd1-M9ZBm-NTF9AijCkEKy9UwM7i3tuSShQw8Pt-53kppn0mlQ-17VKWEylWVoGL4pKg6TenTZP-H4m_F4XfLyvq0wyIm4mZN8FqZXlE2gw7FGUecyvOK-f0sPlQkASNF8sEYbPI8x8gYaV3QKg5sYKtnRliN3wdqV_7bFuRSUax-f10i2rhiBqkZbKbS_w"
        },
        {
            id: 3,
            name: "David Chen",
            role: "Inventory Spec.",
            status: "Active",
            statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30",
            dotColor: "bg-emerald-500",
            initials: "DC",
            initialsColor: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        },
        {
            id: 4,
            name: "Jessica Wu",
            role: "Cashier",
            status: "Inactive",
            statusColor: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30",
            dotColor: "bg-rose-500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Je__x0w0579S6bdFyCxgWqs1O9N3OiJB1H_cwTsimUeF80bsDKFAbh3RUtyQxpRh8rbKkWsh7Tz23SzHcpyakloL99M_mQtjO8nvmi4p0W5R6yCXJ8u4rmFVMg4uCu2x8mfh6o8rGnZmHJ38PMudqQVD4ywzZKw5-XRKhfFHAIr0Zg-JB7b6K6XpMaMNFlC3eH6Y5L0f_FX1tclo3v1YFAGYOM_nu2UsVCS4HZTWyVgPYU1ZFlEXcrJT_IXoTZ-WiqSQmfbD96A"
        },
    ];

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
                        {staffList.slice(0, 5).map((person, index) => (
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default StoreStaffWidget;
