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

  // 选择设备图标的辅助函数
  const getDeviceIcon = (type?: string) => {
    if (type === 'mobile') return '📱';
    if (type === 'tablet') return '📟';
    return '💻';
  };

  return (
    <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 animate-fade-in mt-6 transition-all hover:shadow-2xl duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center">
              <span className="text-2xl text-white">📡</span>
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#16213e] rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#16213e] rounded-full"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Live Traffic</h2>
            <p className="text-gray-400 text-sm">正在访问的设备</p>
          </div>
        </div>
        
        <div className="bg-white/10 px-5 py-2 rounded-xl border border-white/10 text-center">
          <span className="block text-3xl font-bold text-white">{visitors.length}</span>
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">在线</span>
        </div>
      </div>

      <div className="space-y-3">
        {visitors.map((visitor) => (
          <div 
            key={visitor.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
              visitor.isCurrentUser 
                ? 'bg-blue-900/30 border-blue-500/30 shadow-lg shadow-blue-900/10' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              {/* Icon thiết bị */}
              <div className="w-10 h-10 rounded-full bg-[#16213e] flex items-center justify-center text-xl shadow-inner border border-white/5">
                {getDeviceIcon(visitor.deviceInfo?.type)}
              </div>
              
              <div>
                <div className="flex items-center">
                  <p className="text-gray-200 font-mono font-bold text-base mr-2">
                    {visitor.ip}
                  </p>
                  {visitor.isCurrentUser && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full uppercase font-bold shadow-sm shadow-blue-500/30">
                      你
                    </span>
                  )}
                </div>
                
                {/* 显示设备详细信息 */}
                <div className="flex items-center text-xs text-gray-400 mt-1 space-x-2">
                  {visitor.deviceInfo ? (
                    <>
                      <span className="text-blue-300 font-medium">
                         {visitor.deviceInfo.os}
                      </span>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-400">
                         {visitor.deviceInfo.browser}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">匿名设备</span>
                  )}
                </div>
                
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {visitor.location?.city || 'Unknown'}, {visitor.location?.countryCode}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {visitor.isCurrentUser ? (
                 <div className="flex items-center justify-end space-x-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-xs font-semibold">正在活跃</span>
                 </div>
              ) : (
                <p className="text-xs text-gray-500 font-mono">
                  {visitor.accessTime}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {visitors.length === 0 && (
          <div className="text-center py-8 text-gray-500 italic">
            尚无任何访问...
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveTrafficMonitor;