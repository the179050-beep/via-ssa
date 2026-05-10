import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Calendar, Users, Utensils, Hotel, Film, TrendingUp,
  Download, RefreshCw, Eye, EyeOff, Filter, X, Zap, Bell
} from 'lucide-react';
import { useRealtimeBookings, useRealtimeCinema, useRealtimeDine, useRealtimeStay } from '@/hooks/useRealtimeBookings';
import { bookingNotifications, BOOKING_EVENTS } from '@/lib/bookingNotifications';

const FirebaseDataDashboard = () => {
  const { bookings, connected: bookingsConnected } = useRealtimeBookings();
  const { reservations: cinemaReservations } = useRealtimeCinema();
  const { reservations: dineReservations } = useRealtimeDine();
  const { reservations: stayReservations } = useRealtimeStay();

  const [selectedType, setSelectedType] = useState('all');
  const [showDetails, setShowDetails] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newBookingAlert, setNewBookingAlert] = useState(false);

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
      totalReservations: bookings.length + cinemaReservations.length + dineReservations.length + stayReservations.length
    },
    bookings,
    cinemaReservations,
    dineReservations,
    stayReservations
  };

  // Prepare chart data
  const reservationsByType = [
    { name: 'حجوزات', value: stats.summary.totalBookings, color: '#3B82F6' },
    { name: 'سينما', value: stats.summary.totalCinemaReservations, color: '#8B5CF6' },
    { name: 'مطاعم', value: stats.summary.totalDineReservations, color: '#EC4899' },
    { name: 'إقامة', value: stats.summary.totalStayReservations, color: '#F59E0B' },
  ];

  const filteredBookings = selectedType === 'all' || selectedType === 'bookings' ? stats.bookings : [];
  const filteredCinema = selectedType === 'all' || selectedType === 'cinema' ? stats.cinemaReservations : [];
  const filteredDine = selectedType === 'all' || selectedType === 'dine' ? stats.dineReservations : [];
  const filteredStay = selectedType === 'all' || selectedType === 'stay' ? stats.stayReservations : [];

  const exportToJSON = () => {
    const data = {
      summary: stats.summary,
      timestamp: new Date().toISOString(),
      bookings: filteredBookings,
      cinema: filteredCinema,
      dine: filteredDine,
      stay: filteredStay
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم - البيانات المباشرة</h1>
          <p className="text-slate-500 mt-1">عرض وإدارة جميع الحجوزات والزيارات (محدثة فوراً)</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <motion.div
            animate={{ scale: bookingsConnected ? 1.1 : 0.95 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              bookingsConnected
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${bookingsConnected ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse`} />
            {bookingsConnected ? 'متصل' : 'محاولة الاتصال'}
          </motion.div>
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            <Download className="w-4 h-4" /> تحميل JSON
          </button>
        </div>
      </div>

      {/* New Booking Alert */}
      <AnimatePresence>
        {newBookingAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg flex items-center gap-3"
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold">حجز جديد! البيانات تحدثت تلقائياً</span>
            {lastUpdate && (
              <span className="text-blue-100 text-sm">({formatTime(lastUpdate)})</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={Calendar}
          label="الحجوزات"
          value={stats.summary.totalBookings}
          color="#3B82F6"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={Film}
          label="السينما"
          value={stats.summary.totalCinemaReservations}
          color="#8B5CF6"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={Utensils}
          label="المطاعم"
          value={stats.summary.totalDineReservations}
          color="#EC4899"
          bgColor="bg-pink-50"
        />
        <StatCard
          icon={Hotel}
          label="الإقامة"
          value={stats.summary.totalStayReservations}
          color="#F59E0B"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={TrendingUp}
          label="الإجمالي"
          value={stats.summary.totalReservations}
          color="#10B981"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">توزيع الحجوزات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={reservationsByType} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {reservationsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [value, 'العدد']}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">مقارنة الحجوزات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [value, 'العدد']}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Data Tables */}
      <div className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'bookings', 'cinema', 'dine', 'stay'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
              }`}
            >
              {type === 'all' && 'الكل'}
              {type === 'bookings' && 'الحجوزات'}
              {type === 'cinema' && 'السينما'}
              {type === 'dine' && 'المطاعم'}
              {type === 'stay' && 'الإقامة'}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        {filteredBookings.length > 0 && (
          <DataTable
            title="الحجوزات"
            data={filteredBookings}
            columns={['guest_name', 'phone', 'venue_name', 'date', 'time', 'guests_count', 'status']}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            formatDate={formatDate}
          />
        )}

        {/* Cinema Table */}
        {filteredCinema.length > 0 && (
          <DataTable
            title="حجوزات السينما"
            data={filteredCinema}
            columns={['guestName', 'guestEmail', 'movieName', 'date', 'time', 'seats']}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            formatDate={formatDate}
          />
        )}

        {/* Dine Table */}
        {filteredDine.length > 0 && (
          <DataTable
            title="حجوزات المطاعم"
            data={filteredDine}
            columns={['guestName', 'guestPhone', 'restaurantName', 'date', 'time', 'guests']}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            formatDate={formatDate}
          />
        )}

        {/* Stay Table */}
        {filteredStay.length > 0 && (
          <DataTable
            title="حجوزات الإقامة"
            data={filteredStay}
            columns={['guestName', 'guestEmail', 'hotelName', 'checkIn', 'checkOut', 'rooms']}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`${bgColor} rounded-xl p-6 border border-slate-200 shadow-md`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      </div>
      <Icon className="w-10 h-10" style={{ color }} opacity={0.7} />
    </div>
  </motion.div>
);

const DataTable = ({ title, data, columns, expandedRow, setExpandedRow, formatDate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
  >
    <div className="p-6 border-b border-slate-200">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{data.length} سجل</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
            >
              {columns.map((col) => (
                <td key={col} className="px-6 py-3 text-sm text-slate-600">
                  {row[col] ? (
                    typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col]).slice(0, 30)
                  ) : (
                    '-'
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default FirebaseDataDashboard;
