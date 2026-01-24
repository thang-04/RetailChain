import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import staffService from '@/services/staff.service';

const StaffCalendar = () => {
  const [shifts, setShifts] = useState([]);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['08:00', '12:00', '16:00', '20:00'];

  useEffect(() => {
    const fetchShifts = async () => {
      const data = await staffService.getShifts();
      setShifts(data);
    };
    fetchShifts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shift Calendar</h2>
          <p className="text-muted-foreground">Weekly schedule for store staff.</p>
        </div>
        <div className="flex gap-2">
            <Select defaultValue="week">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Day View</SelectItem>
                    <SelectItem value="week">Week View</SelectItem>
                    <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
            </Select>
            <Button>
                <span className="material-symbols-outlined mr-2">calendar_add_on</span>
                Assign Shift
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>January 2024 - Week 4</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon"><span className="material-symbols-outlined">chevron_left</span></Button>
                    <Button variant="outline" size="icon"><span className="material-symbols-outlined">chevron_right</span></Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-4 border rounded-lg p-4">
            <div className="font-bold text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">Time / Day</div>
            {daysOfWeek.map(day => (
              <div key={day} className="font-bold text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">{day}</div>
            ))}

            {timeSlots.map(time => (
              <>
                <div key={time} className="font-medium text-center py-4 border-b text-sm text-gray-500">{time}</div>
                {daysOfWeek.map(day => (
                  <div key={`${day}-${time}`} className="border-b min-h-[80px] p-1 relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {/* Mock logic to place shifts randomly for demo */}
                    {Math.random() > 0.7 && (
                        <div className="bg-primary/10 text-primary border border-primary/20 p-2 rounded text-xs cursor-pointer hover:bg-primary/20">
                            <div className="font-semibold">Nguyen Van A</div>
                            <div>Cashier</div>
                        </div>
                    )}
                  </div>
                ))}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffCalendar;
