import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardStats from "@/components/dashboard/DashboardStats";
import BookingsTable from "@/components/dashboard/BookingsTable";
import VisitorsTable from "@/components/dashboard/VisitorsTable";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || u.role !== "admin") navigate("/");
      else setUser(u);
    });
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white" dir="rtl">
      {/* Top Bar */}
      <div className="border-b border-white/8 bg-[#111] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white font-bold text-base tracking-wide" style={{ fontFamily: "'El Messiri', sans-serif" }}>
              لوحة تحكم ڤيا رياض
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">{user.full_name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-bold">
              {user.full_name?.[0] || "A"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <DashboardStats />

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
          {[
            { key: "bookings", label: "الحجوزات" },
            { key: "visitors", label: "الزوار" },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === t.key ? "bg-primary text-primary-foreground shadow" : "text-white/50 hover:text-white"
              }`} style={{ fontFamily: "'El Messiri', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {activeTab === "bookings" ? <BookingsTable /> : <VisitorsTable />}
      </div>
    </div>
  );
}