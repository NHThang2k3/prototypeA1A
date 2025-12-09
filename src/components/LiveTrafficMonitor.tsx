// src/components/LiveTrafficMonitor.tsx

import { useEffect, useState } from 'react';
import type { DetailedUserInfo } from '../services/IPService';
import { 
  registerPresence, 
  subscribeToVisitors, 
  goOffline,
  type LiveVisitor 
} from '../services/TrafficService';

interface LiveTrafficMonitorProps {
  currentUser: DetailedUserInfo;
}

function LiveTrafficMonitor({ currentUser }: LiveTrafficMonitorProps) {
  const [visitors, setVisitors] = useState<LiveVisitor[]>([]);

  useEffect(() => {
    // 1. Đăng ký bản thân lên server
    registerPresence(currentUser);

    // 2. Lắng nghe thay đổi
    const unsubscribe = subscribeToVisitors(currentUser, (realData) => {
      setVisitors(realData);
    });

    // 3. Cleanup
    return () => {
      unsubscribe();
      goOffline(currentUser.ip);
    };
  }, [currentUser]);

  return (
    // Container: Nền trắng, shadow mềm, border xám nhạt
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade-in mt-6 transition-all hover:shadow-2xl duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative mr-4">
            {/* Icon nền Gradient có bóng đổ màu */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center">
              <span className="text-2xl text-white">📡</span>
            </div>
            {/* Blinking dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Live Traffic</h2>
            <p className="text-slate-500 text-sm">Đang truy cập thời gian thực</p>
          </div>
        </div>
        
        {/* Counter Box: Nền xám nhạt */}
        <div className="bg-slate-50 px-5 py-2 rounded-xl border border-slate-200 text-center">
          <span className="block text-3xl font-bold text-slate-800">{visitors.length}</span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Online</span>
        </div>
      </div>

      {/* Visitor List */}
      <div className="space-y-3">
        {visitors.map((visitor) => (
          <div 
            key={visitor.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              visitor.isCurrentUser 
                /* Style cho bản thân: Nền xanh nhạt, viền xanh */
                ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                /* Style cho người khác: Nền trắng, hover xám nhạt */
                : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Status Dot */}
              <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white ${visitor.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-400'}`}></div>
              
              <div>
                <p className="text-slate-700 font-mono font-semibold text-sm md:text-base flex items-center">
                  {visitor.ip}
                  {visitor.isCurrentUser && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full uppercase font-bold shadow-sm shadow-blue-500/30">
                      You
                    </span>
                  )}
                </p>
                <div className="flex items-center text-xs text-slate-500 space-x-2 mt-0.5">
                  <span className="font-medium text-slate-600">{visitor.location?.city || 'Unknown City'}, {visitor.location?.countryCode}</span>
                  <span className="text-slate-300">•</span>
                  <span>{visitor.username}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">
                {visitor.isCurrentUser ? (
                  <span className="text-green-600 font-semibold">Đang hoạt động</span>
                ) : (
                  `Truy cập: ${visitor.accessTime}`
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs italic">
          * Dữ liệu các người dùng khác đang được mô phỏng cho mục đích demo (Cần Firebase/Socket cho real-time thật)
        </p>
      </div>
    </div>
  );
}

export default LiveTrafficMonitor;