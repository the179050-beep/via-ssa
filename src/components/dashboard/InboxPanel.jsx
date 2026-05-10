import { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const messages = [
  { id: 1, from: 'سارة جونسون', subject: 'سؤال حول الأسعار', preview: 'مرحباً، أتساءل إن كنتم تقدمون خصومات للاشتراكات السنوية...', time: '10:42 ص', unread: true },
  { id: 2, from: 'مايكل تشن', subject: 'تأكيد الطلب', preview: 'هل يمكنك تأكيد معالجة طلبي رقم #1038 من فضلك؟', time: '9:15 ص', unread: true },
  { id: 3, from: 'إيما ويلسون', subject: 'فرصة شراكة', preview: 'أود مناقشة تعاون محتمل بين شركتينا...', time: 'أمس', unread: false },
  { id: 4, from: 'ديفيد كيم', subject: 'طلب دعم', preview: 'أواجه مشكلة في الوصول إلى حسابي، هل يمكنك مساعدتي في إعادة الضبط؟', time: 'أمس', unread: false },
  { id: 5, from: 'ليزا أندرسون', subject: 'ملاحظات على الميزات الجديدة', preview: 'أردت فقط أن أعلمك أن لوحة التحكم الجديدة تبدو رائعة!', time: 'منذ يومين', unread: false },
  { id: 6, from: 'جيمس براون', subject: 'سؤال حول الفاتورة', preview: 'لاحظت تناقضاً في فاتورتي الأخيرة، هل يمكننا جدولة مكالمة؟', time: 'منذ 3 أيام', unread: false },
];

export default function InboxPanel() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = messages.filter(m =>
    m.from.includes(search) || m.subject.includes(search)
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E8ECF0] overflow-hidden">
      {/* Search */}
      <div className="px-6 py-4 border-b border-[#E8ECF0]">
        <div className="flex items-center gap-3 justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input
              placeholder="البحث في الرسائل..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              dir="rtl"
              className="w-full bg-[#F7F8FA] border border-[#DFE3E8] rounded-lg pr-9 pl-4 py-2 text-sm text-[#2D3748] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#116DFF]"
            />
          </div>
          <span className="text-[#A0AEC0] text-xs">
            {messages.filter(m => m.unread).length} غير مقروءة
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="divide-y divide-[#F0F2F5]">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-[#A0AEC0] text-sm">لا توجد رسائل</div>
        ) : filtered.map(msg => (
          <button
            key={msg.id}
            onClick={() => setSelected(msg.id)}
            dir="rtl"
            className={`w-full text-right px-6 py-4 hover:bg-[#FAFBFC] transition-colors flex items-start gap-3 ${
              selected === msg.id ? 'bg-[#EEF2FF]' : msg.unread ? 'bg-[#F7F8FF]' : ''
            }`}
          >
            <Avatar className="h-9 w-9 shrink-0 mt-0.5">
              <AvatarFallback className="bg-[#EEF2FF] text-[#116DFF] text-xs font-bold">
                {msg.from.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm truncate ${msg.unread ? 'font-bold text-[#1A202C]' : 'font-medium text-[#4A5568]'}`}>
                  {msg.from}
                </p>
                <span className="text-[11px] text-[#A0AEC0] whitespace-nowrap">{msg.time}</span>
              </div>
              <p className={`text-sm truncate ${msg.unread ? 'font-semibold text-[#1A202C]' : 'text-[#6B7280]'}`}>
                {msg.subject}
              </p>
              <p className="text-xs text-[#A0AEC0] truncate mt-0.5">{msg.preview}</p>
            </div>
            {msg.unread && <span className="w-2 h-2 rounded-full bg-[#116DFF] shrink-0 mt-2" />}
          </button>
        ))}
      </div>
    </div>
  );
}