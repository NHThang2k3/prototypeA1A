// src/components/LiveTrafficMonitor.tsx
//
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
    registerPresence(currentUser);

    const unsubscribe = subscribeToVisitors((realData) => {
      setVisitors(realData);
    });

    return () => {
      unsubscribe();
      goOffline(currentUser.ip);
    };
  }, [currentUser]);

  return (
    // 容器：深色背景 (#16213e) + 浅色模糊边框
    <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 animate-fade-in mt-6 transition-all hover:shadow-2xl duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center">
              <span className="text-2xl text-white">📡</span>
            </div>
            {/* Ping animation */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#16213e] rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#16213e] rounded-full"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Live Traffic</h2>
            <p className="text-gray-400 text-sm">实时正在访问</p>
          </div>
        </div>
        
        {/* 计数框：浅色透明背景 */}
        <div className="bg-white/10 px-5 py-2 rounded-xl border border-white/10 text-center">
          <span className="block text-3xl font-bold text-white">{visitors.length}</span>
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Online</span>
        </div>
      </div>

      {/* Visitor List */}
      <div className="space-y-3">
        {visitors.map((visitor) => (
          <div 
            key={visitor.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              visitor.isCurrentUser 
                /* 自身样式：深蓝背景，浅蓝边框 */
                ? 'bg-blue-900/30 border-blue-500/30 shadow-lg shadow-blue-900/10' 
                /* 其他人样式：透明背景，悬停微亮 */
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Status Dot */}
              <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-[#16213e] ${visitor.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'}`}></div>
              
              <div>
                <p className="text-gray-200 font-mono font-semibold text-sm md:text-base flex items-center">
                  {visitor.ip}
                  {visitor.isCurrentUser && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full uppercase font-bold shadow-sm shadow-blue-500/30">
                      You
                    </span>
                  )}
                </p>
                <div className="flex items-center text-xs text-gray-400 space-x-2 mt-0.5">
                  <span className="font-medium text-gray-300">{visitor.location?.city || 'Unknown City'}, {visitor.location?.countryCode}</span>
                  <span className="text-gray-600">•</span>
                  <span>{visitor.username}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">
                {visitor.isCurrentUser ? (
                  <span className="text-green-400 font-semibold">正在活动</span>
                ) : (
                  `访问: ${visitor.accessTime}`
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveTrafficMonitor;