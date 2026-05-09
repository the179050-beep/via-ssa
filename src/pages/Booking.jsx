import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Users, Phone, Mail, User, CheckCircle, Hotel, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const restaurants = [
  "اوڤر اندر", "بيرنجاك", "جيم خانا", "ستيلا سكاي لاونج",
  "سدس", "فيردي", "فيقا سيجار لاونج", "ماديو", "مطعم جاكي", "هوتشو"
];

const timeSlots = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "06:00 PM",
  "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM",
  "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM",
  "10:30 PM", "11:00 PM", "11:30 PM",
];

const today = new Date().toISOString().split("T")[0];

export default function Booking() {
  const [bookingType, setBookingType] = useState("restaurant");
  const [form, setForm] = useState({
    venue_name: "",
    guest_name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests_count: 2,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await base44.entities.Booking.create({
      ...form,
      type: bookingType,
      guests_count: Number(form.guests_count),
      status: "pending",
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-background text-foreground min-h-screen" dir="rtl">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary to-background pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">ڤيا رياض</span>
          <h1
            className="font-bold text-foreground mb-4"
            style={{ fontFamily: "'El Messiri', system-ui, sans-serif", fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            احجز تجربتك
          </h1>
          <p className="text-muted-foreground text-lg">احجز طاولتك في أحد مطاعمنا أو غرفتك في فندق سانت ريجس</p>
        </motion.div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary border border-primary/30 p-12 text-center"
              >
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2
                  className="text-foreground text-3xl font-bold mb-4"
                  style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}
                >
                  تم استلام حجزك!
                </h2>
                <p className="text-muted-foreground mb-2">
                  سنتواصل معك قريباً على الرقم أو البريد المدخل لتأكيد الحجز.
                </p>
                <p className="text-primary text-sm mb-8">{form.venue_name} — {form.date} — {form.time}</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => { setSubmitted(false); setForm({ venue_name: "", guest_name: "", phone: "", email: "", date: "", time: "", guests_count: 2, notes: "" }); }}
                    className="border border-primary/40 text-primary px-6 py-3 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    حجز جديد
                  </button>
                  <Link
                    to="/Dine"
                    className="bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    <span>عودة للمطاعم</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "restaurant", label: "مطعم", icon: <UtensilsCrossed className="w-5 h-5" /> },
                    { value: "hotel", label: "فندق", icon: <Hotel className="w-5 h-5" /> },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setBookingType(opt.value); set("venue_name", ""); }}
                      className={`flex items-center justify-center gap-3 py-4 border transition-all duration-300 text-sm font-semibold ${
                        bookingType === opt.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/40 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="bg-secondary border border-border/30 p-8 space-y-5">
                  {/* Venue */}
                  <div>
                    <label className="text-foreground text-sm font-semibold block mb-2">
                      {bookingType === "restaurant" ? "اختر المطعم" : "الفندق"}
                    </label>
                    {bookingType === "restaurant" ? (
                      <div className="relative">
                        <select
                          required
                          value={form.venue_name}
                          onChange={e => set("venue_name", e.target.value)}
                          className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">-- اختر مطعماً --</option>
                          {restaurants.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    ) : (
                      <div className="bg-muted border border-border/40 px-4 py-3 text-sm text-foreground">
                        فندق سانت ريجس — ڤيا رياض
                      </div>
                    )}
                  </div>

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-primary" /> الاسم الكامل
                      </label>
                      <input
                        required
                        type="text"
                        value={form.guest_name}
                        onChange={e => set("guest_name", e.target.value)}
                        placeholder="محمد العمري"
                        className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <div>
                      <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" /> رقم الجوال
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={e => set("phone", e.target.value)}
                        placeholder="05xxxxxxxx"
                        className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" /> البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                      dir="ltr"
                    />
                  </div>

                  {/* Date + Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> التاريخ
                      </label>
                      <input
                        required
                        type="date"
                        min={today}
                        value={form.date}
                        onChange={e => set("date", e.target.value)}
                        className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-primary" /> عدد الضيوف
                      </label>
                      <div className="flex items-center gap-3 bg-muted border border-border/40 px-4 py-3">
                        <button type="button" onClick={() => set("guests_count", Math.max(1, form.guests_count - 1))} className="text-primary font-bold text-lg w-6 h-6 flex items-center justify-center hover:text-foreground transition-colors">−</button>
                        <span className="flex-1 text-center text-foreground text-sm font-semibold">{form.guests_count}</span>
                        <button type="button" onClick={() => set("guests_count", Math.min(20, form.guests_count + 1))} className="text-primary font-bold text-lg w-6 h-6 flex items-center justify-center hover:text-foreground transition-colors">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="text-foreground text-sm font-semibold block mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> الوقت المفضل
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.time}
                        onChange={e => set("time", e.target.value)}
                        className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
                        dir="ltr"
                      >
                        <option value="">-- اختر الوقت --</option>
                        {timeSlots.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-foreground text-sm font-semibold block mb-2">ملاحظات خاصة (اختياري)</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => set("notes", e.target.value)}
                      placeholder="مناسبة خاصة، طلبات غذائية، ..."
                      className="w-full bg-muted border border-border/40 text-foreground px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {error && <p className="text-destructive text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !form.time || !form.date || !form.venue_name || (!bookingType === "restaurant" ? false : !form.venue_name)}
                  className="w-full relative overflow-hidden bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-widest hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%]" />
                  <span className="relative">{loading ? "جاري الإرسال..." : "تأكيد الحجز"}</span>
                  {!loading && <ArrowLeft className="w-4 h-4 relative" />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function UtensilsCrossed(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
      <path d="m2 22 3-3"/>
    </svg>
  );
}