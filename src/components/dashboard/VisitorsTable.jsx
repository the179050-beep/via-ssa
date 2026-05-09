import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Plus, Trash2, CreditCard } from "lucide-react";

const STATUS_DOT = {
  online: "bg-green-400",
  idle: "bg-yellow-400",
  offline: "bg-white/20",
};
const STATUS_LABEL = { online: "متصل", idle: "خامل", offline: "غير متصل" };

export default function VisitorsTable() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", card_name: "", card_last4: "", card_type: "Visa", online_status: "offline", country: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.Visitor.list("-created_date", 200).then(data => { setVisitors(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = visitors.filter(v =>
    !search || [v.full_name, v.email, v.phone, v.country].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const setF = (k, val) => setForm(f => ({ ...f, [k]: val }));

  const handleAdd = async () => {
    if (!form.full_name || !form.email || !form.phone) return;
    setSaving(true);
    await base44.entities.Visitor.create(form);
    setSaving(false);
    setShowAdd(false);
    setForm({ full_name: "", email: "", phone: "", card_name: "", card_last4: "", card_type: "Visa", online_status: "offline", country: "", notes: "" });
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.Visitor.delete(id);
    setVisitors(prev => prev.filter(v => v.id !== id));
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Visitor.update(id, { online_status: status });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, online_status: status } : v));
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50";

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8 flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'El Messiri', sans-serif" }}>الزوار</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث..." dir="rtl"
              className="bg-white/5 border border-white/10 rounded-xl pr-9 pl-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 w-52" />
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> إضافة زائر
          </button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-4">
            <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'El Messiri', sans-serif" }}>إضافة زائر جديد</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-white/40 text-xs mb-1 block">الاسم الكامل *</label><input value={form.full_name} onChange={e => setF("full_name", e.target.value)} className={inputCls} placeholder="محمد العمري" /></div>
              <div><label className="text-white/40 text-xs mb-1 block">البريد الإلكتروني *</label><input value={form.email} onChange={e => setF("email", e.target.value)} className={inputCls} placeholder="m@example.com" dir="ltr" /></div>
              <div><label className="text-white/40 text-xs mb-1 block">رقم الجوال *</label><input value={form.phone} onChange={e => setF("phone", e.target.value)} className={inputCls} placeholder="05xxxxxxxx" dir="ltr" /></div>
              <div><label className="text-white/40 text-xs mb-1 block">الدولة</label><input value={form.country} onChange={e => setF("country", e.target.value)} className={inputCls} placeholder="السعودية" /></div>
              <div><label className="text-white/40 text-xs mb-1 block">اسم حامل البطاقة</label><input value={form.card_name} onChange={e => setF("card_name", e.target.value.toUpperCase())} className={inputCls + " font-mono"} placeholder="NAME ON CARD" dir="ltr" /></div>
              <div><label className="text-white/40 text-xs mb-1 block">آخر 4 أرقام</label><input value={form.card_last4} onChange={e => setF("card_last4", e.target.value.replace(/\D/g, "").slice(0, 4))} className={inputCls + " font-mono"} placeholder="1234" dir="ltr" /></div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">نوع البطاقة</label>
                <select value={form.card_type} onChange={e => setF("card_type", e.target.value)} className={inputCls}>
                  {["Visa", "Mastercard", "Mada", "Amex", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">الحالة</label>
                <select value={form.online_status} onChange={e => setF("online_status", e.target.value)} className={inputCls}>
                  <option value="online">متصل</option>
                  <option value="idle">خامل</option>
                  <option value="offline">غير متصل</option>
                </select>
              </div>
            </div>
            <div><label className="text-white/40 text-xs mb-1 block">ملاحظات</label><textarea value={form.notes} onChange={e => setF("notes", e.target.value)} rows={2} className={inputCls + " resize-none"} /></div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving || !form.full_name || !form.email || !form.phone}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-white/8 text-white py-2.5 rounded-xl text-sm hover:bg-white/12 transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

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
                {["الحالة", "الاسم", "البريد", "الجوال", "بيانات البطاقة", "الدولة", "إجراء"].map(h => (
                  <th key={h} className="text-right px-5 py-3.5 text-white/40 font-medium text-xs tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-white/25">لا توجد زوار، أضف واحداً الآن</td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${STATUS_DOT[v.online_status] || "bg-white/20"}`} />
                      <span className="text-white/50 text-xs">{STATUS_LABEL[v.online_status] || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {v.full_name?.[0] || "?"}
                      </div>
                      <span className="text-white font-medium whitespace-nowrap">{v.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-xs whitespace-nowrap" dir="ltr">{v.email || "—"}</td>
                  <td className="px-5 py-4 text-white/60 font-mono text-xs whitespace-nowrap" dir="ltr">{v.phone || "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {v.card_last4 ? (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-white/60 font-mono text-xs" dir="ltr">{v.card_type} •••• {v.card_last4}</span>
                      </div>
                    ) : <span className="text-white/20 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-4 text-white/60 text-xs whitespace-nowrap">{v.country || "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select value={v.online_status} onChange={e => updateStatus(v.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none">
                        <option value="online">متصل</option>
                        <option value="idle">خامل</option>
                        <option value="offline">غير متصل</option>
                      </select>
                      <button onClick={() => handleDelete(v.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="px-6 py-3 border-t border-white/8 text-white/30 text-xs">
        {filtered.length} من {visitors.length} زائر
      </div>
    </div>
  );
}