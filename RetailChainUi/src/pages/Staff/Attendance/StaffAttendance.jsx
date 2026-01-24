import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StaffAttendance = () => {
    // Mock attendance data
    const attendanceData = [
        { id: 1, staff: "Nguyen Van A", date: "2024-01-25", checkIn: "07:55", checkOut: "17:05", status: "On Time", workHours: 8.2 },
        { id: 2, staff: "Tran Thi B", date: "2024-01-25", checkIn: "08:10", checkOut: "17:00", status: "Late", workHours: 7.8 },
        { id: 3, staff: "Pham Thi D", date: "2024-01-25", checkIn: "07:50", checkOut: "--:--", status: "Working", workHours: 4.5 },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance & Performance</h2>
                    <p className="text-muted-foreground">Monitor daily check-ins and work hours.</p>
                </div>
                <Button variant="outline">Export Report</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 / 15</div>
                        <p className="text-xs text-muted-foreground">3 staff on leave</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                        <span className="material-symbols-outlined text-yellow-500">schedule</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">+1 from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Work Hours</CardTitle>
                        <span className="material-symbols-outlined text-blue-500">timelapse</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.1h</div>
                        <p className="text-xs text-muted-foreground">Standard is 8.0h</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daily Attendance Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Work Hours</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendanceData.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.staff}</TableCell>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.checkIn}</TableCell>
                                    <TableCell>{record.checkOut}</TableCell>
                                    <TableCell>{record.workHours}h</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            record.status === 'On Time' ? 'default' : 
                                            record.status === 'Late' ? 'destructive' : 'secondary'
                                        }>
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffAttendance;
