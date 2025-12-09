// src/pages/IPTrackingDashboardPage.tsx

import { useEffect, useState, useRef } from 'react';
import { getDetailedUserInfo, clearCache, type DetailedUserInfo } from '../../services/IPService';
import LiveTrafficMonitor from '../../components/LiveTrafficMonitor';
// 1. 导入新组件
import DailyTrafficChart from '../../components/DailyTrafficChart';
import { incrementVisitCount } from '../../services/TrafficService';
//

function IPTrackingDashboardPage() {
  const [userInfo, setUserInfo] = useState<DetailedUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    
    async function fetchDetailedInfo() {
      try {
        hasFetched.current = true;
        setLoading(true);
        const info = await getDetailedUserInfo();
        setUserInfo(info);
        incrementVisitCount(); 
      } catch (err) {
        setError('无法获取用户信息');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetailedInfo();
  }, []);

  const handleRefresh = async () => {
    clearCache();
    hasFetched.current = false;
    setLoading(true);
    setError(null);
    try {
      const info = await getDetailedUserInfo(true);
      setUserInfo(info);
    } catch (err) {
      setError('无法刷新信息');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    background: 'radial-gradient(circle at top left, #1a1a2e, #16213e, #0f3460)',
    minHeight: '100vh'
  };

  if (loading) {
    return (
      <div style={pageStyle} className="flex items-center justify-center pt-16">
        <div className="text-center animate-fade-in">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-300 text-xl font-medium">正在加载信息...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle} className="flex items-center justify-center pt-16">
        <div className="bg-[#16213e] rounded-3xl p-8 shadow-2xl border border-red-500/30 animate-fade-in text-center max-w-md mx-4">
          <p className="text-red-400 text-xl font-medium mb-4">⚠️ {error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-all border border-red-500/20"
          >
            🔄 重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle} className="overflow-y-auto h-screen pt-24 pb-12 px-4 text-gray-200">
      <div className="max-w-6xl mx-auto">
        
        {/* 用户信息卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 用户身份卡片 */}
          <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 animate-fade-in hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center mr-4">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-white">个人信息</h2>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1 font-medium uppercase tracking-wider">用户名</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                  {userInfo?.username}
                </p>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <p className="text-gray-400 font-medium">IP地址</p>
                <p className="text-white text-xl font-mono font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/5">
                  {userInfo?.ip}
                </p>
              </div>

              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <p className="text-gray-400 font-medium">访问时间</p>
                <p className="text-gray-300 text-right text-sm">
                  {userInfo?.accessTime}
                </p>
              </div>
            </div>
          </div>

          {/* 地理位置卡片 */}
          <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center mr-4">
                <span className="text-2xl text-white">🌍</span>
              </div>
              <h2 className="text-2xl font-bold text-white">地理位置</h2>
            </div>

            {userInfo?.location ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-gray-400 font-medium pt-1">国家</p>
                  <p className="text-white text-lg font-bold text-right">
                    {userInfo.location.country} <span className="text-gray-500 text-base font-normal">({userInfo.location.countryCode})</span>
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <p className="text-gray-400 font-medium pt-1">区域</p>
                  <p className="text-gray-200 text-right font-medium">
                    {userInfo.location.city}, {userInfo.location.regionName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                      <p className="text-gray-500 text-xs mb-1 uppercase">时区</p>
                      <p className="text-gray-200 font-semibold">{userInfo.location.timezone}</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl text-center border border-white/5">
                      <p className="text-gray-500 text-xs mb-1 uppercase">坐标</p>
                      <p className="text-gray-200 font-mono text-sm">{userInfo.location.lat}, {userInfo.location.lon}</p>
                   </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">无法获取地理位置信息</p>
            )}
          </div>
        </div>

        {/* 网络信息卡片 */}
        <div className="bg-[#16213e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-black/20 border border-white/10 animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center mr-4">
              <span className="text-2xl text-white">🌐</span>
            </div>
            <h2 className="text-2xl font-bold text-white">网络信息</h2>
          </div>

          {userInfo?.location ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-4 md:pt-0">
                <p className="text-gray-400 text-sm mb-2 font-medium">互联网服务提供商 (ISP)</p>
                <p className="text-white text-lg font-semibold">
                  {userInfo.location.isp}
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <p className="text-gray-400 text-sm mb-2 font-medium">组织</p>
                <p className="text-white text-lg">
                  {userInfo.location.org}
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <p className="text-gray-400 text-sm mb-2 font-medium">AS Number</p>
                <p className="text-blue-300 text-sm font-mono bg-blue-500/20 inline-block px-2 py-1 rounded border border-blue-500/30">
                  {userInfo.location.as}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">无法获取网络信息</p>
          )}
        </div>

        {/* --- 2. 在这里添加图表 --- */}
        <div className="mt-6">
          <DailyTrafficChart />
        </div>

        {/* 实时流量监控部分 */}
        <div className="mt-6">
            {userInfo && <LiveTrafficMonitor currentUser={userInfo} />}
        </div>

        {/* 刷新按钮 */}
        <div className="text-center mt-10 pb-10">
          <button
            onClick={handleRefresh}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-900/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center mx-auto gap-2 border border-white/10"
          >
           刷新信息
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default IPTrackingDashboardPage;