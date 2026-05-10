import { useVisitorTracking, getPageDisplayName, getTimeAgo } from '@/hooks/useVisitorTracking';
import { Users, Wifi, WifiOff, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActiveVisitorsWidget() {
  const { activeVisitors, loading } = useVisitorTracking();

  if (loading) {
    return (
      <div className="bg-background border border-border/20 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-border/20 rounded w-1/3"></div>
          <div className="h-3 bg-border/20 rounded"></div>
          <div className="h-3 bg-border/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/10 rounded-xl p-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
              الزوار النشطون
            </h3>
            <p className="text-muted-foreground text-xs">{activeVisitors.length} زائر متصل الآن</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-green-600 font-semibold">نشط</span>
        </div>
      </div>

      {/* Visitors List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activeVisitors.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">لا يوجد زوار نشطون حالياً</p>
        ) : (
          activeVisitors.map((visitor, idx) => (
            <motion.div
              key={visitor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-background/50 border border-border/30 rounded-lg p-3 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {visitor.name?.charAt(0) || 'V'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {visitor.name || 'زائر'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate">
                      {getPageDisplayName(visitor.current_page)}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-xs text-muted-foreground">
                    {getTimeAgo(visitor.last_activity_at)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {activeVisitors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>آخر تحديث: الآن</span>
          <span>{activeVisitors.length} من الزوار نشطون</span>
        </div>
      )}
    </motion.div>
  );
}
