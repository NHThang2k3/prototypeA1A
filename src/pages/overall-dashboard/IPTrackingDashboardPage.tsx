// src/pages/IPTrackingDashboardPage.tsx

import { useEffect, useState, useRef } from 'react';
import { getDetailedUserInfo, clearCache, type DetailedUserInfo } from '../../services/IPService';
import LiveTrafficMonitor from '../../components/LiveTrafficMonitor';

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
      } catch (err) {
        setError('Không thể lấy thông tin người dùng');
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
      setError('Không thể làm mới thông tin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center animate-fade-in">
          {/* Sửa border-white thành border-blue-600 để thấy được trên nền trắng */}
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 text-xl font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        {/* Sửa background thành trắng + shadow để nổi bật */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-red-100 animate-fade-in text-center max-w-md mx-4">
          <p className="text-red-500 text-xl font-medium mb-4">⚠️ {error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50/50"> {/* Thêm bg-gray-50 nhẹ để tạo độ sâu cho trang */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            📊 Dashboard
          </h1>
          <p className="text-slate-500 text-lg">
            Thông tin chi tiết về kết nối của bạn
          </p>
        </div>

        {/* User Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Identity Card */}
          {/* Sửa style card: bg-white, shadow, border nhẹ */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade-in hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center mr-4">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thông tin cá nhân</h2>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-400 text-sm mb-1 font-medium uppercase tracking-wider">Tên người dùng</p>
                {/* Gradient đậm hơn (500/600) để rõ trên nền sáng */}
                <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {userInfo?.username}
                </p>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <p className="text-slate-500 font-medium">Địa chỉ IP</p>
                <p className="text-slate-800 text-xl font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg">
                  {userInfo?.ip}
                </p>
              </div>

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <p className="text-slate-500 font-medium">Thời gian truy cập</p>
                <p className="text-slate-700 text-right text-sm">
                  {userInfo?.accessTime}
                </p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade-in hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center mr-4">
                <span className="text-2xl text-white">🌍</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Vị trí địa lý</h2>
            </div>

            {userInfo?.location ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 font-medium pt-1">Quốc gia</p>
                  <p className="text-slate-800 text-lg font-bold text-right">
                    {userInfo.location.country} <span className="text-slate-400 text-base font-normal">({userInfo.location.countryCode})</span>
                  </p>
                </div>

                <div className="flex justify-between items-start">
                  <p className="text-slate-500 font-medium pt-1">Khu vực</p>
                  <p className="text-slate-800 text-right font-medium">
                    {userInfo.location.city}, {userInfo.location.regionName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div className="bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-slate-400 text-xs mb-1 uppercase">Múi giờ</p>
                      <p className="text-slate-700 font-semibold">{userInfo.location.timezone}</p>
                   </div>
                   <div className="bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-slate-400 text-xs mb-1 uppercase">Tọa độ</p>
                      <p className="text-slate-700 font-mono text-sm">{userInfo.location.lat}, {userInfo.location.lon}</p>
                   </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Không thể lấy thông tin địa lý</p>
            )}
          </div>
        </div>

        {/* Network Info Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-fade-in hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center mr-4">
              <span className="text-2xl text-white">🌐</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Thông tin mạng</h2>
          </div>

          {userInfo?.location ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="pt-4 md:pt-0">
                <p className="text-slate-500 text-sm mb-2 font-medium">Nhà cung cấp (ISP)</p>
                <p className="text-slate-800 text-lg font-semibold">
                  {userInfo.location.isp}
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <p className="text-slate-500 text-sm mb-2 font-medium">Tổ chức</p>
                <p className="text-slate-800 text-lg">
                  {userInfo.location.org}
                </p>
              </div>

              <div className="pt-4 md:pt-0 md:pl-6">
                <p className="text-slate-500 text-sm mb-2 font-medium">AS Number</p>
                <p className="text-blue-600 text-sm font-mono bg-blue-50 inline-block px-2 py-1 rounded">
                  {userInfo.location.as}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">Không thể lấy thông tin mạng</p>
          )}
        </div>

        {/* Live Traffic Monitor Section */}
        {/* Đảm bảo component con này cũng hỗ trợ light mode hoặc nằm trong container phù hợp */}
        <div className="mt-6">
            {userInfo && <LiveTrafficMonitor currentUser={userInfo} />}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-10 pb-10">
          <button
            onClick={handleRefresh}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-lg shadow-slate-900/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center mx-auto gap-2"
          >
            <span>🔄</span> Làm mới thông tin
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            💡 Thông tin được lấy từ địa chỉ IP công khai của bạn
          </p>
        </div>
      </div>
    </div>
  );
}

export default IPTrackingDashboardPage;