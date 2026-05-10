import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Calendar, Users, Utensils, Hotel, Film, TrendingUp,
  Download, RefreshCw, Eye, EyeOff, Filter, X
} from 'lucide-react';
import { getAllStats } from '@/lib/firebaseService';

const FirebaseDataDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [showDetails, setShowDetails] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllStats();
      setStats(data);
    } catch (error) {
      console.error('[v0] Error loading Firebase data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) return date.toDate().toLocaleDateString('ar-SA');
    if (typeof date === 'string') return new Date(date).toLocaleDateString('ar-SA');
    return new Date(date).toLocaleDateString('ar-SA');
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم - بيانات Firebase</h1>
          <p className="text-slate-500 mt-1">عرض وإدارة جميع الحجوزات والزيارات</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> تحديث
        </button>
      </div>

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
          icon={Users}
          label="الزوار"
          value={stats.summary.totalVisitors}
          color="#10B981"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">توزيع الحجوزات</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reservationsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reservationsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">إجمالي الحجوزات حسب النوع</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'الكل', icon: Filter },
          { value: 'bookings', label: 'الحجوزات', icon: Calendar },
          { value: 'cinema', label: 'السينما', icon: Film },
          { value: 'dine', label: 'المطاعم', icon: Utensils },
          { value: 'stay', label: 'الإقامة', icon: Hotel },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedType(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedType === tab.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Tables */}
      <div className="space-y-6">
        {(selectedType === 'all' || selectedType === 'bookings') && filteredBookings.length > 0 && (
          <DataTable
            title="الحجوزات"
            icon={Calendar}
            data={filteredBookings}
            columns={['guest_name', 'email', 'venue_name', 'date', 'time', 'guests', 'status']}
            columnLabels={{
              guest_name: 'الاسم',
              email: 'البريد الإلكتروني',
              venue_name: 'المكان',
              date: 'التاريخ',
              time: 'الوقت',
              guests: 'عدد الأشخاص',
              status: 'الحالة',
            }}
          />
        )}

        {(selectedType === 'all' || selectedType === 'cinema') && filteredCinema.length > 0 && (
          <DataTable
            title="حجوزات السينما"
            icon={Film}
            data={filteredCinema}
            columns={['movieName', 'date', 'time', 'seats', 'guestEmail', 'guestPhone']}
            columnLabels={{
              movieName: 'اسم الفيلم',
              date: 'التاريخ',
              time: 'الوقت',
              seats: 'المقاعد',
              guestEmail: 'البريد الإلكتروني',
              guestPhone: 'رقم الهاتف',
            }}
          />
        )}

        {(selectedType === 'all' || selectedType === 'dine') && filteredDine.length > 0 && (
          <DataTable
            title="حجوزات المطاعم"
            icon={Utensils}
            data={filteredDine}
            columns={['restaurantName', 'date', 'time', 'guests', 'guestName', 'guestPhone']}
            columnLabels={{
              restaurantName: 'اسم المطعم',
              date: 'التاريخ',
              time: 'الوقت',
              guests: 'عدد الأشخاص',
              guestName: 'الاسم',
              guestPhone: 'رقم الهاتف',
            }}
          />
        )}

        {(selectedType === 'all' || selectedType === 'stay') && filteredStay.length > 0 && (
          <DataTable
            title="حجوزات الإقامة"
            icon={Hotel}
            data={filteredStay}
            columns={['hotelName', 'checkIn', 'checkOut', 'rooms', 'guestName', 'guestEmail']}
            columnLabels={{
              hotelName: 'اسم الفندق',
              checkIn: 'تاريخ الدخول',
              checkOut: 'تاريخ المغادرة',
              rooms: 'عدد الغرف',
              guestName: 'الاسم',
              guestEmail: 'البريد الإلكتروني',
            }}
          />
        )}

        {selectedType === 'all' && stats.visitors.length > 0 && (
          <DataTable
            title="الزوار"
            icon={Users}
            data={stats.visitors}
            columns={['name', 'email', 'phone', 'createdAt']}
            columnLabels={{
              name: 'الاسم',
              email: 'البريد الإلكتروني',
              phone: 'رقم الهاتف',
              createdAt: 'تاريخ الزيارة',
            }}
          />
        )}

        {selectedType === 'all' &&
          filteredBookings.length === 0 &&
          filteredCinema.length === 0 &&
          filteredDine.length === 0 &&
          filteredStay.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-500">لا توجد بيانات متاحة</p>
            </div>
          )}
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            const dataStr = JSON.stringify(stats, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `firebase-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg"
        >
          <Download className="w-5 h-5" />
          تنزيل البيانات (JSON)
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// STAT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl shadow-md p-5 border border-slate-200 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <Icon style={{ color }} className="w-6 h-6" />
        <span className="text-xs font-semibold text-slate-500 uppercase">+0%</span>
      </div>
      <p className="text-slate-600 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DATA TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════

function DataTable({ title, icon: Icon, data, columns, columnLabels }) {
  const [expanded, setExpanded] = useState(null);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="ml-auto text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {data.length} عنصر
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">
                  {columnLabels[col] || col}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase">تفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.slice(0, 10).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-6 py-4 text-sm text-slate-700">
                    <span className="line-clamp-1">
                      {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] || 'N/A')}
                    </span>
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    {expanded === idx ? <EyeOff className="w-4 h-4 inline" /> : <Eye className="w-4 h-4 inline" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Details */}
      {expanded !== null && (
        <div className="bg-slate-50 border-t border-slate-200 p-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4">التفاصيل الكاملة</h4>
            <pre className="text-xs text-slate-700 overflow-auto bg-slate-100 p-3 rounded border border-slate-300">
              {JSON.stringify(data[expanded], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {data.length > 10 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-600">
          عرض 10 من {data.length} عنصر
        </div>
      )}
    </div>
  );
}

export default FirebaseDataDashboard;
