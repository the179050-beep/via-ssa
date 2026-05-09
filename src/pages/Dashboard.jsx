import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import DashboardStats from "@/components/dashboard/DashboardStats";
import BookingsTable from "@/components/dashboard/BookingsTable";
import VisitorsTable from "@/components/dashboard/VisitorsTable";
import {
  LayoutDashboard, CalendarCheck, Users, Settings,
  Bell, Search, ChevronDown, LogOut, Menu, X
} from "lucide-react";

const NAV = [
  { key: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "bookings", label: "الحجوزات", icon: CalendarCheck },
  { key: "visitors", label: "الزوار", icon: Users },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || u.role !== "admin") navigate("/");
      else setUser(u);
    });
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-[#116dff] border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex" dir="rtl" style={{ fontFamily: "'El Messiri', sans-serif" }}>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full z-40 flex flex-col bg-white border-l border-[#e8e8e8] transition-all duration-300 ${sidebarOpen ? "w-[240px]" : "w-[64px]"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[#e8e8e8] gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#116dff] flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-[#17191c] text-sm tracking-tight whitespace-nowrap">ڤيا رياض</span>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} className="mr-auto text-[#6b7280] hover:text-[#17191c] transition-colors">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active ? "bg-[#116dff] text-white shadow-sm" : "text-[#6b7280] hover:bg-[#f4f5f7] hover:text-[#17191c]"
                }`}>
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-[#9ca3af] group-hover:text-[#116dff]"}`} />
                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className={`border-t border-[#e8e8e8] p-3 flex items-center gap-3 ${sidebarOpen ? "" : "justify-center"}`}>
          <div className="w-8 h-8 rounded-full bg-[#116dff]/15 flex items-center justify-center text-[#116dff] text-xs font-bold shrink-0">
            {user.full_name?.[0] || "A"}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <div className="text-[#17191c] text-xs font-semibold truncate">{user.full_name}</div>
              <div className="text-[#9ca3af] text-[10px] truncate">{user.email}</div>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={() => base44.auth.logout("/")} className="text-[#9ca3af] hover:text-red-400 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "mr-[240px]" : "mr-[64px]"}`}>

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#e8e8e8] flex items-center px-6 gap-4 sticky top-0 z-30">
          <div className="flex-1">
            <div className="relative max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input placeholder="بحث..." dir="rtl"
                className="w-full bg-[#f4f5f7] border border-[#e8e8e8] rounded-xl pr-9 pl-4 py-2 text-sm text-[#17191c] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#116dff] transition-colors" />
            </div>
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-[#f4f5f7] flex items-center justify-center text-[#6b7280] hover:bg-[#e8e8e8] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#116dff]" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#116dff]/15 flex items-center justify-center text-[#116dff] text-xs font-bold">
              {user.full_name?.[0] || "A"}
            </div>
            <span className="text-[#17191c] text-sm font-medium hidden md:block">{user.full_name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-[#17191c] text-2xl font-bold">
              {activeTab === "overview" && "نظرة عامة"}
              {activeTab === "bookings" && "إدارة الحجوزات"}
              {activeTab === "visitors" && "إدارة الزوار"}
            </h1>
            <p className="text-[#6b7280] text-sm mt-1">
              {activeTab === "overview" && "مرحباً بك في لوحة تحكم ڤيا رياض"}
              {activeTab === "bookings" && "عرض وإدارة جميع الحجوزات"}
              {activeTab === "visitors" && "عرض وإدارة بيانات الزوار"}
            </p>
          </div>

          {/* Stats always visible on overview */}
          {(activeTab === "overview" || activeTab === "bookings" || activeTab === "visitors") && (
            <DashboardStats activeTab={activeTab} />
          )}

          {activeTab === "bookings" && <BookingsTable />}
          {activeTab === "visitors" && <VisitorsTable />}

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-[#17191c] font-bold mb-4">آخر الحجوزات</h3>
                <BookingsTable compact />
              </div>
              <div className="bg-white rounded-2xl border border-[#e8e8e8] p-6">
                <h3 className="text-[#17191c] font-bold mb-4">الزوار النشطون</h3>
                <VisitorsTable compact />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}