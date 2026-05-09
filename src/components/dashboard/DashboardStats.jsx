import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, CalendarCheck, UserCheck, Clock } from "lucide-react";

export default function DashboardStats() {
  const [bookings, setBookings] = useState([]);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    base44.entities.Booking.list().then(setBookings).catch(() => {});
    base44.entities.Visitor.list().then(setVisitors).catch(() => {});
  }, []);

  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const online = visitors.filter(v => v.online_status === "online").length;

  const stats = [
    { label: "إجمالي الحجوزات", value: bookings.length, icon: <CalendarCheck className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
    { label: "مؤكدة", value: confirmed, icon: <UserCheck className="w-5 h-5" />, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "قيد الانتظار", value: pending, icon: <Clock className="w-5 h-5" />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "الزوار", value: visitors.length, icon: <Users className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "متصلون الآن", value: online, icon: <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#161616] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/15 transition-colors">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
            {s.icon}
          </div>
          <div>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}