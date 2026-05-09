import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, ChevronDown } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-400/15 text-yellow-400",
  confirmed: "bg-green-400/15 text-green-400",
  cancelled: "bg-red-400/15 text-red-400",
};
const STATUS_LABELS = { pending: "قيد الانتظار", confirmed: "مؤكد", cancelled: "ملغى" };
const TYPE_LABELS = { restaurant: "مطعم", hotel: "فندق", cinema: "سينما" };

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    base44.entities.Booking.list("-created_date", 200).then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Booking.update(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !search || [b.guest_name, b.email, b.phone, b.venue_name].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'El Messiri', sans-serif" }}>الحجوزات</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث..." dir="rtl"
              className="bg-white/5 border border-white/10 rounded-xl pr-9 pl-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 w-52" />
          </div>
          <div className="relative">
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none appearance-none pr-8">
              <option value="all">الكل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">مؤكد</option>
              <option value="cancelled">ملغى</option>
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["الاسم", "الجوال", "البريد", "النوع", "الوجهة", "التاريخ", "الوقت", "الضيوف", "الحالة", "إجراء"].map(h => (
                  <th key={h} className="text-right px-5 py-3.5 text-white/40 font-medium text-xs tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 text-white/25">لا توجد نتائج</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-4 text-white font-medium whitespace-nowrap">{b.guest_name || "—"}</td>
                  <td className="px-5 py-4 text-white/60 font-mono text-xs whitespace-nowrap" dir="ltr">{b.phone || "—"}</td>
                  <td className="px-5 py-4 text-white/60 text-xs whitespace-nowrap" dir="ltr">{b.email || "—"}</td>
                  <td className="px-5 py-4 text-white/60 whitespace-nowrap">{TYPE_LABELS[b.type] || b.type}</td>
                  <td className="px-5 py-4 text-white/80 whitespace-nowrap max-w-[120px] truncate">{b.venue_name || "—"}</td>
                  <td className="px-5 py-4 text-white/60 font-mono text-xs whitespace-nowrap" dir="ltr">{b.date || "—"}</td>
                  <td className="px-5 py-4 text-white/60 font-mono text-xs whitespace-nowrap" dir="ltr">{b.time || "—"}</td>
                  <td className="px-5 py-4 text-white/60 text-center">{b.guests_count ?? "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || "bg-white/10 text-white/40"}`}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="relative">
                      <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/70 focus:outline-none appearance-none">
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">تأكيد</option>
                        <option value="cancelled">إلغاء</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="px-6 py-3 border-t border-white/8 text-white/30 text-xs">
        {filtered.length} من {bookings.length} حجز
      </div>
    </div>
  );
}