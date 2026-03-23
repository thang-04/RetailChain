import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import shiftService from '@/services/shift.service';

// Helper: lấy thứ Hai đầu tuần
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper: format ngày
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const StaffCalendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
  const [loading, setLoading] = useState(false);
  const daysOfWeek = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];
  const timeSlots = ['08:00', '12:00', '16:00', '20:00'];

  // TODO: lấy storeId từ context/route
  const storeId = 1;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const sunday = weekDays[6];

  const weekNumber = (() => {
    const d = new Date(Date.UTC(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  })();

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const from = formatDate(currentMonday);
      const to = formatDate(sunday);
      const result = await shiftService.getAssignments(storeId, from, to);
      if (result?.code === 200 && result?.data) {
        setAssignments(result.data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("Error loading assignments:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [currentMonday, storeId]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const goToPrevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  // Nhóm assignments theo ngày + time slot
  const getAssignmentsForSlot = (dayIdx, timeSlot) => {
    const day = weekDays[dayIdx];
    const dayStr = formatDate(day);
    const slotHour = parseInt(timeSlot.split(":")[0]);
    const nextSlotHour = slotHour + 4; // Mỗi slot cách nhau 4 giờ

    return assignments.filter(a => {
      if (a.status === "CANCELLED") return false;
      if (a.workDate !== dayStr) return false;
      const startHour = parseInt(a.startTime.split(":")[0]);
      return startHour >= slotHour && startHour < nextSlotHour;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lịch ca làm</h2>
          <p className="text-muted-foreground">Lịch làm việc theo tuần cho nhân viên cửa hàng.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chế độ xem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Xem theo ngày</SelectItem>
              <SelectItem value="week">Xem theo tuần</SelectItem>
              <SelectItem value="month">Xem theo tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {monthNames[currentMonday.getMonth()]} {currentMonday.getFullYear()} - Tuần {weekNumber}
              {loading && <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevWeek}>
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextWeek}>
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-4 border rounded-lg p-4">
            <div className="font-bold text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">Giờ / Ngày</div>
            {daysOfWeek.map((day, idx) => (
              <div key={day} className="font-bold text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
                {day} <span className="text-xs font-normal text-muted-foreground">{weekDays[idx].getDate()}</span>
              </div>
            ))}

            {timeSlots.map(time => (
              <>
                <div key={time} className="font-medium text-center py-4 border-b text-sm text-gray-500">{time}</div>
                {daysOfWeek.map((day, dayIdx) => {
                  const slotAssignments = getAssignmentsForSlot(dayIdx, time);
                  return (
                    <div key={`${day}-${time}`} className="border-b min-h-[80px] p-1 relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {slotAssignments.map(a => (
                        <div key={a.id} className="bg-primary/10 text-primary border border-primary/20 p-2 rounded text-xs cursor-pointer hover:bg-primary/20 mb-1">
                          <div className="font-semibold">{a.userName}</div>
                          <div>{a.shiftName}</div>
                          <Badge variant="outline" className="text-[10px] mt-1">{a.startTime} - {a.endTime}</Badge>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffCalendar;
